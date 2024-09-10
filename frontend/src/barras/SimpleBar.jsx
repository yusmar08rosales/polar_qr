import React from "react";

//componentes
import { useNavigate } from "react-router-dom";
import { Button, Toolbar, AppBar, Tooltip } from "@mui/material";

//iconos
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const SimpleBar = () => {
    //estados
    const navigate = useNavigate();

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
                </Toolbar>
            </AppBar>
        </>
    )
}
export default SimpleBar;