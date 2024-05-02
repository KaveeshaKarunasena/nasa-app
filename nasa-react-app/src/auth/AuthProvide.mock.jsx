import React from 'react';

export const mockAuthContext = React.createContext();

export const AuthProvider = ({ children }) => (
  <mockAuthContext.Provider value={{ login: jest.fn(), navigate: jest.fn() }}>
    {children}
  </mockAuthContext.Provider>
);
