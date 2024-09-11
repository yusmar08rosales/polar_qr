import React from "react";
import axios from 'axios';

//componentes
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button, Toolbar, AppBar, Tooltip } from "@mui/material";

//iconos
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LogoutIcon from '@mui/icons-material/Logout';
import DensityMediumIcon from '@mui/icons-material/DensityMedium';

const BarraSupe = () => {
    //estados
    const navigate = useNavigate();
    const { setUser } = useAuth();

    //boton de cierre de sesión 
    const handleLogout = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('userInfo')).user;
            await axios.post('http://localhost:3000/cierreSesion', { user });
            localStorage.removeItem('userInfo');
            setUser({});
            navigate('/');
        } catch (err) {
            console.error("error al cerrar sesión: ", err);
        }
    };

    const handleRegist = async () => {
        navigate('/registro');
    };

    const handleHistory = async () => {
        navigate('/History');
    };

    return (
        <>
            <AppBar position="static" sx={{ background: "linear-gradient(90deg, rgba(8,96,205,1) 30%, rgba(2,129,250,1) 66%)" }}>
                <Toolbar>
                    <Tooltip title={"cierre de sesión"}>
                        <Button color="inherit" onClick={handleLogout}>
                            <LogoutIcon />
                        </Button>
                    </Tooltip>
                    <div style={{ flexGrow: 1 }}></div>
                    <Tooltip title={"historico de modificaciones"}>
                        <Button color="inherit" onClick={handleHistory}>
                            <DensityMediumIcon />
                        </Button>
                    </Tooltip>
                    <Tooltip title={"registrar usuario"}>
                        <Button color="inherit" onClick={handleRegist}>
                            <PersonAddIcon />
                        </Button>
                    </Tooltip>
                </Toolbar>
            </AppBar>
        </>
    )
}
export default BarraSupe;