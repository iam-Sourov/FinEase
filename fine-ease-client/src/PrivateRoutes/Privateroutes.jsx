import React from 'react';
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Contexts/AuthContext';


const Privateroutes = ({ children }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  
  if (user && user?.email) {
    return children;
  } else {
    return <Navigate state={location.pathname} to={'/login'} ></Navigate>
  }

};

export default Privateroutes;