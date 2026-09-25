import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router';
import { AuthContext } from '../Contexts/AuthContext';
import { Spinner } from "@/components/ui/spinner";

const Privateroutes = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 min-h-[50vh]">
        <Spinner className="h-10 w-10 text-primary" />
      </div>
    );
  }

  if (user && user?.email) {
    return children;
  } else {
    return <Navigate state={location.pathname} to={'/login'} replace />;
  }
};

export default Privateroutes;