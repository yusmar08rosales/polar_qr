import React, { useState } from "react";

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

const ListaProductSeniat = () => {
    //estado de los productos
    const [ products, setProducts ] = useState ([
        {
           id: 1,
           loteFabricacion: '233HG32',
           fechaVencimiento: '15 de Marz. de 2024',
           fechaFabricacion: '23 DE FEB. DE 2024'
        },
        {
            id: 2,
            loteFabricacion: 'VJH2242J',
            fechaVencimiento: '05 de Abr. de 2024',
            fechaFabricacion: '30 DE Oct. DE 2024'
        },
        {
            id: 3,
            loteFabricacion: '32DFS32',
            fechaVencimiento: '24 de Sep. de 2024',
            fechaFabricacion: '23 DE Ener. DE 2024'
        },
    ]);

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
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {products.map((product) => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            {`caja ${product.id}`}
                                        </TableCell>
                                        <TableCell>
                                            {product.loteFabricacion}
                                        </TableCell>
                                        <TableCell>
                                            {product.fechaFabricacion}
                                        </TableCell>
                                        <TableCell>
                                            {product.fechaVencimiento}
                                        </TableCell>
                                    </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </>
    )
}
export default ListaProductSeniat;