import React from "react";
import { useAuth } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roles }) => {
    const { user } = useAuth();

    if (!user || !user.rol) {
        return <Navigate to="/" />;
    } else if (!roles.includes(user.rol)) {
        return <Navigate to={user.rol === 'admin' ? '/lote' : user.rol === 'seniat' ? '/ListadoLote' : '/registroLote'} />;
    }

    return children;
};

export default ProtectedRoute;
