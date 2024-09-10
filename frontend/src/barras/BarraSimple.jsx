import React from "react";

//componentes
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Toolbar, AppBar, Tooltip } from "@mui/material";

//iconos
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const BarraSimple = () => {
    //estados
    const navigate = useNavigate();
    const { setUser } = useAuth();

    //boton de cierre de sesión 
    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser({});
        navigate('/');
    };

    const handleRegreso = async () => {
        navigate('/lote');
    };

    return (
        <>
            <AppBar position="static" sx={{ background: "linear-gradient(90deg, rgba(8,96,205,1) 30%, rgba(2,129,250,1) 66%)" }}>
                <Toolbar>
                    <Tooltip title={"regreso a la tabla de lotes"}>
                        <Button color="inherit" onClick={handleRegreso}>
                            <ArrowBackIcon />
                        </Button>
                    </Tooltip>
                    <div style={{ flexGrow: 1 }}></div>
                    <Tooltip title={"cierre de sesión"}>
                        <Button color="inherit" onClick={handleLogout}>
                            <LogoutIcon />
                        </Button>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </>
    )
}
export default BarraSimple;