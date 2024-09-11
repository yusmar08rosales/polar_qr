import React, { useState } from "react";
import '../tabla.css'

//componentes
import BarraSeniat from "../barras/BarraSeniat";

//dependecias
import { TextField, Button, InputAdornment, Tooltip } from "@mui/material";

//componented de tabla de los productos
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';


//iconos
import SearchIcon from "@mui/icons-material/Search";
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import { useNavigate } from "react-router-dom";

const ListaLoteSeniat = () => {
    const navigate = useNavigate();

    const handleLote = () => {
        navigate('/ListadoProducto')
    }

    return (
        <>
            <div className="container">
                <BarraSeniat />

                <div className="list">
                    <div className="filtro">
                        <Tooltip title={"escanear QR"}>
                            <Button /*onClick={handleAgregarLote}*/>
                                <QrCodeScannerIcon />
                            </Button>
                        </Tooltip>
                        <TextField
                            fullWidth
                            autoFocus
                            type='text'
                            color='primary'
                            margin='normal'
                            variant='outlined'
                            placeholder='Filtro'
                            //value={values.user}
                            //onChange={e => setValues({ ...values, user: e.target.value })}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>

                    <div className="table">
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Item de Lote</TableCell>
                                        <TableCell>Lote de fabricación</TableCell>
                                        <TableCell>Fecha de embarque</TableCell>
                                        <TableCell>Origen</TableCell>
                                        <TableCell>Número de embarque</TableCell>
                                        <TableCell>Codigo de SENIAT</TableCell>
                                        <TableCell>Fecha de desembarque</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            <Button className="button-product" onClick={handleLote}>
                                                Lote 1
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            A65BF9NH
                                        </TableCell>
                                        <TableCell>
                                            23 DE FEB. DE 2024
                                        </TableCell>
                                        <TableCell>
                                            Holanda
                                        </TableCell>
                                        <TableCell>
                                            346598
                                        </TableCell>
                                        <TableCell>
                                            34b87uy2
                                        </TableCell>
                                        <TableCell>
                                            15 de Marzo de 2024
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </>
    );
};
export default ListaLoteSeniat;