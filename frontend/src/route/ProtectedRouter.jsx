import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useAuth();

    if (!user || !user.rol) {
        return <Navigate to="/" />;
    } else if (!roles.includes(user.rol)) {
        return <Navigate to={user.rol === 'user' ? '/usuario' : user.rol === 'users' ? '/users': '/' } />;
    }

    return children;
};

export default ProtectedRoute;
