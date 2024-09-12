import React from "react";
import axios from 'axios';

//componentes
import { useNavigate } from "react-router-dom";
import { Button, Toolbar, AppBar, Tooltip } from "@mui/material";
import { useAuth } from "../auth/AuthContext";

//iconos
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SimpleBar = () => {
    //estados
    const navigate = useNavigate();
    const { user, setUser } = useAuth();// Acceder al estado del usuario
    const userRole = user.rol;
    console.log(userRole);
    

    const handleLogout = async () => {
        try {
            // Verifica si 'userInfo' está en localStorage
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                // Si 'userInfo' existe, obtén el usuario
                const users = JSON.parse(userInfo).user;
                
                // Envía la solicitud de cierre de sesión
                await axios.post('http://localhost:3000/cierreSesion', { users });
                
                // Limpia el almacenamiento local y actualiza el estado del usuario
                localStorage.removeItem('userInfo');
                setUser({});
                navigate('/');
            } else {
                setUser({});
                navigate('/');
            }
        } catch (err) {
            console.error("Error al cerrar sesión: ", err);
        }
    };
    

    const handleRegreso = async () => {
        navigate('/lote');
    };

    return (
        <>
            <AppBar position="static" sx={{ background: "linear-gradient(90deg, rgba(8,96,205,1) 30%, rgba(2,129,250,1) 66%)" }}>
                <Toolbar>

                    {userRole === 'admin' && (
                        <Tooltip title={"regreso a la tabla de lotes"}>
                            <Button color="inherit" onClick={handleRegreso}>
                                <ArrowBackIcon />
                            </Button>
                        </Tooltip>
                    )}

                    {userRole === 'pasante' && (
                        <Tooltip title={"cierre de sesión"}>
                            <Button color="inherit" onClick={handleLogout}>
                                <LogoutIcon />
                            </Button>
                        </Tooltip>
                    )}
                </Toolbar>
            </AppBar>
        </>
    )
}
export default SimpleBar;