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
          const userInfo = localStorage.getItem('userInfo');
          if (userInfo) {
            const users = JSON.parse(userInfo).user;
            await axios.post('https://backendpaginaqr-production.up.railway.app/cierreSesion', { user: users });
            localStorage.removeItem('userInfo');
            setUser({});
            navigate('/');
          } else {
            console.error('No user info found in localStorage');
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