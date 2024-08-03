import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('userInfo')) || {});

  useEffect(() => {
    // Actualizar el almacenamiento local cuando el usuario cambie
    localStorage.setItem('userInfo', JSON.stringify(user));
  }, [user]);

  const loginUser = (userData) => {
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('userInfo'); // Borra la información del usuario del almacenamiento local
    setUser({}); // Resetea el estado del usuario
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
