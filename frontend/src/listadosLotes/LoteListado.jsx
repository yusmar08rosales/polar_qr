import React from "react";

//componentes
import BarraSimple from "../barras/BarraSimple";

//componented de tabla de los productos
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

//dependencias
import { TextField, InputAdornment } from "@mui/material";

//iconos
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';

const LoteListado = () => {
 
    return (
        <>
            <div className="container">
                <BarraSimple />

                <div className="list">
                    <div className="filtro">
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
                                        <TableCell>Fecha de vencimiento</TableCell>
                                        <TableCell>Fecha de fabricación</TableCell>
                                        <TableCell>Modificar</TableCell>
                                        <TableCell>Eliminar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    <TableRow>
                                        <TableCell>
                                            Caja 1
                                        </TableCell>
                                        <TableCell>
                                            A65BF9NH
                                        </TableCell>
                                        <TableCell>
                                            23 DE FEB. DE 2024
                                        </TableCell>
                                        <TableCell>
                                            15 de Marzo de 2024
                                        </TableCell>
                                        <TableCell>
                                            <CreateIcon />
                                        </TableCell>
                                        <TableCell>
                                            <DeleteIcon />
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </>
    )
}
export default LoteListado;