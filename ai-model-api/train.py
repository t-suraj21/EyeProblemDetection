import argparse
import json
import os
from pathlib import Path
from typing import Tuple

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader, random_split
from torchvision import datasets, models, transforms
from sklearn.metrics import classification_report


def build_transforms(img_size: int) -> Tuple[transforms.Compose, transforms.Compose]:
    train_tf = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.RandomApply([transforms.ColorJitter(0.2, 0.2, 0.2, 0.1)], p=0.5),
        transforms.RandomHorizontalFlip(p=0.5),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.RandomRotation(degrees=10),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    val_tf = transforms.Compose([
        transforms.Resize((img_size, img_size)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ])
    return train_tf, val_tf


def create_datasets(data_dir: Path, img_size: int, val_split: float) -> Tuple[datasets.ImageFolder, datasets.ImageFolder]:
    data_dir = Path(data_dir)
    train_dir = data_dir / "train"
    val_dir = data_dir / "val"

    if train_dir.exists() and val_dir.exists():
        # Pre-split layout
        train_tf, val_tf = build_transforms(img_size)
        train_ds = datasets.ImageFolder(train_dir, transform=train_tf)
        val_ds = datasets.ImageFolder(val_dir, transform=val_tf)
        # Ensure class order consistent
        val_ds.classes = train_ds.classes
        val_ds.class_to_idx = train_ds.class_to_idx
        return train_ds, val_ds

    # Single folder; split automatically
    full_tf, _ = build_transforms(img_size)
    full_ds = datasets.ImageFolder(data_dir, transform=full_tf)
    val_len = int(len(full_ds) * val_split)
    train_len = len(full_ds) - val_len
    train_ds, val_ds = random_split(full_ds, [train_len, val_len])

    # Patch attributes for random_split subsets
    train_ds.dataset.class_to_idx = full_ds.class_to_idx
    val_ds.dataset.class_to_idx = full_ds.class_to_idx
    return train_ds, val_ds


def validate_dataset_dir(data_dir: Path) -> None:
    if not data_dir.exists():
        raise FileNotFoundError(f"Dataset directory not found: {data_dir}")
    # Check for at least one class subfolder (non-empty)
    has_subdir = any(p.is_dir() for p in data_dir.iterdir())
    has_tr_val = (data_dir / "train").exists() and (data_dir / "val").exists()
    if not (has_subdir or has_tr_val):
        raise FileNotFoundError(
            "Dataset folder must contain class subfolders (e.g., dataset/CLASS_A, dataset/CLASS_B) "
            "or pre-split folders dataset/train/* and dataset/val/*."
        )


def build_model(arch: str, num_classes: int, pretrained: bool = True) -> nn.Module:
    arch = arch.lower()
    if arch in ["resnet50", "resnet"]:
        model = models.resnet50(weights=models.ResNet50_Weights.IMAGENET1K_V2 if pretrained else None)
        in_features = model.fc.in_features
        model.fc = nn.Linear(in_features, num_classes)
        return model
    elif arch in ["efficientnet_b0", "efficientnet"]:
        model = models.efficientnet_b0(weights=models.EfficientNet_B0_Weights.IMAGENET1K_V1 if pretrained else None)
        in_features = model.classifier[-1].in_features
        model.classifier[-1] = nn.Linear(in_features, num_classes)
        return model
    else:
        raise ValueError(f"Unsupported arch: {arch}")


def train_one_epoch(model, loader, criterion, optimizer, device, scaler):
    model.train()
    running_loss = 0.0
    correct = 0
    total = 0

    for inputs, targets in loader:
        inputs = inputs.to(device, non_blocking=True)
        targets = targets.to(device, non_blocking=True)

        optimizer.zero_grad(set_to_none=True)
        with torch.cuda.amp.autocast(enabled=scaler is not None):
            outputs = model(inputs)
            loss = criterion(outputs, targets)
        if scaler is not None:
            scaler.scale(loss).backward()
            scaler.step(optimizer)
            scaler.update()
        else:
            loss.backward()
            optimizer.step()

        running_loss += loss.item() * inputs.size(0)
        _, preds = torch.max(outputs, 1)
        correct += torch.sum(preds == targets).item()
        total += targets.size(0)

    return running_loss / total, correct / total


def evaluate(model, loader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct = 0
    total = 0
    all_preds = []
    all_targets = []

    with torch.no_grad():
        for inputs, targets in loader:
            inputs = inputs.to(device, non_blocking=True)
            targets = targets.to(device, non_blocking=True)
            outputs = model(inputs)
            loss = criterion(outputs, targets)

            running_loss += loss.item() * inputs.size(0)
            _, preds = torch.max(outputs, 1)
            correct += torch.sum(preds == targets).item()
            total += targets.size(0)

            all_preds.extend(preds.cpu().tolist())
            all_targets.extend(targets.cpu().tolist())

    avg_loss = running_loss / total
    acc = correct / total
    report = classification_report(all_targets, all_preds, zero_division=0, output_dict=True)
    return avg_loss, acc, report


def save_labels_json(class_to_idx: dict, path: Path):
    idx_to_class = {int(v): str(k) for k, v in class_to_idx.items()}
    with open(path, "w", encoding="utf-8") as f:
        json.dump(idx_to_class, f, indent=2)


def main():
    parser = argparse.ArgumentParser(description="Train EyeCare model on ImageFolder dataset")
    parser.add_argument("data_dir", type=str, help="Path to dataset directory (ImageFolder layout). Either class subfolders directly or train/ and val/ subfolders.")
    parser.add_argument("--arch", type=str, default="resnet50", choices=["resnet50", "efficientnet_b0"], help="Model architecture")
    parser.add_argument("--img_size", type=int, default=224)
    parser.add_argument("--batch_size", type=int, default=16)
    parser.add_argument("--epochs", type=int, default=10)
    parser.add_argument("--lr", type=float, default=1e-4)
    parser.add_argument("--val_split", type=float, default=0.15)
    parser.add_argument("--weights_out", type=str, default="weights/model.pt")
    parser.add_argument("--labels_out", type=str, default="labels.json")
    parser.add_argument("--num_workers", type=int, default=4)
    parser.add_argument("--no_pretrained", action="store_true", help="Do not use ImageNet pretrained weights")
    args = parser.parse_args()

    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Device: {device}")

    # Validate dataset path early with a clear message
    data_path = Path(args.data_dir)
    validate_dataset_dir(data_path)

    # Datasets & loaders
    train_ds, val_ds = create_datasets(data_path, img_size=args.img_size, val_split=args.val_split)

    # Recover classes regardless of split type
    if isinstance(train_ds, datasets.ImageFolder):
        classes = train_ds.classes
        class_to_idx = train_ds.class_to_idx
    else:
        classes = train_ds.dataset.classes
        class_to_idx = train_ds.dataset.class_to_idx

    print(f"Classes: {classes}")
    save_labels_json(class_to_idx, Path(args.labels_out))

    train_loader = DataLoader(train_ds, batch_size=args.batch_size, shuffle=True, num_workers=args.num_workers, pin_memory=True)
    val_loader = DataLoader(val_ds, batch_size=args.batch_size, shuffle=False, num_workers=args.num_workers, pin_memory=True)

    # Model
    model = build_model(args.arch, num_classes=len(classes), pretrained=not args.no_pretrained)
    model.to(device)

    # Optimizer, loss, scheduler
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.lr)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=args.epochs)
    scaler = torch.cuda.amp.GradScaler(enabled=(device.type == "cuda"))

    best_val_acc = 0.0
    best_state = None
    patience = 5
    patience_ctr = 0

    for epoch in range(1, args.epochs + 1):
        train_loss, train_acc = train_one_epoch(model, train_loader, criterion, optimizer, device, scaler)
        val_loss, val_acc, report = evaluate(model, val_loader, criterion, device)
        scheduler.step()

        print(f"Epoch {epoch:02d} | train_loss={train_loss:.4f} acc={train_acc:.4f} | val_loss={val_loss:.4f} acc={val_acc:.4f}")

        if val_acc > best_val_acc:
            best_val_acc = val_acc
            best_state = model.state_dict()
            patience_ctr = 0
        else:
            patience_ctr += 1

        if patience_ctr >= patience:
            print("Early stopping")
            break

    if best_state is None:
        best_state = model.state_dict()

    # Save weights
    weights_out = Path(args.weights_out)
    weights_out.parent.mkdir(parents=True, exist_ok=True)
    torch.save(best_state, weights_out)
    print(f"Saved best model to {weights_out}")

    # Final evaluation report
    print("Validation classification report:")
    print(json.dumps(report, indent=2))


if __name__ == "__main__":
    main()
