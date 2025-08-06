import { createContext, useContext, useReducer } from 'react';

const ResultContext = createContext();

const initialState = {
  scanResult: null,
  isScanning: false,
  user: null,
  scanHistory: []
};

const resultReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCAN_RESULT':
      return {
        ...state,
        scanResult: action.payload,
        isScanning: false,
        scanHistory: [...state.scanHistory, action.payload]
      };
    case 'SET_SCANNING':
      return {
        ...state,
        isScanning: action.payload
      };
    case 'SET_USER':
      return {
        ...state,
        user: action.payload
      };
    case 'CLEAR_RESULT':
      return {
        ...state,
        scanResult: null
      };
    default:
      return state;
  }
};

export const ResultProvider = ({ children }) => {
  const [state, dispatch] = useReducer(resultReducer, initialState);

  const setScanResult = (result) => {
    dispatch({ type: 'SET_SCAN_RESULT', payload: result });
  };

  const setScanning = (isScanning) => {
    dispatch({ type: 'SET_SCANNING', payload: isScanning });
  };

  const setUser = (user) => {
    dispatch({ type: 'SET_USER', payload: user });
  };

  const clearResult = () => {
    dispatch({ type: 'CLEAR_RESULT' });
  };

  const value = {
    ...state,
    setScanResult,
    setScanning,
    setUser,
    clearResult
  };

  return (
    <ResultContext.Provider value={value}>
      {children}
    </ResultContext.Provider>
  );
};

export const useResult = () => {
  const context = useContext(ResultContext);
  if (!context) {
    throw new Error('useResult must be used within a ResultProvider');
  }
  return context;
}; 