import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom"; // Hook para obtener los parámetros de la URL

//componentes
import BarraSimple from "../barras/BarraSimple";

//componentes de tabla de los productos
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
//import DeleteIcon from '@mui/icons-material/Delete';

const LoteListado = () => {
    const location = useLocation(); //locacización de las paginas
    const [ products, setProducts ] = useState([]);
    const [ lote, setLote ] = useState("");
    const [ llamada, setLlamada ] = useState(false);

    /*--------------------------------------------------------------------
     localiza el producto seleccionado para cargar toda su información
    --------------------------------------------------------------------*/
    useEffect(() => {
        if (location.state && location.state.loteId && !llamada) {
            const loteId = location.state.loteId;
            console.log("lote listado", loteId);
            if (lote !== loteId) {
                setLote(loteId);
                setLlamada(true);
            }
        } else {
            setLlamada(false);
        }
    }, [location.state, llamada]);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!lote) return; // Solo hacer la llamada si hay un loteId disponible

            try {
                const response = await fetch("http://localhost:3000/visualizarProductos", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ loteId: lote }) // Envía el loteId correctamente
                });

                if (!response.ok) {
                    throw new Error('Error al obtener los productos del lote');
                }

                const result = await response.json();
                setProducts(result.data); // Almacena los productos obtenidos en el estado
            } catch (error) {
                console.error("Error al mostrar el historial:", error);
            }
        };

        fetchProducts();
    }, [lote]); // Hacer la llamada cada vez que cambie el lote

    return (
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
                                    <TableCell>Lote de Fabricación</TableCell>
                                    <TableCell>Fecha de Vencimiento</TableCell>
                                    <TableCell>Fecha de Fabricación</TableCell>
                                    <TableCell>Modificar</TableCell>
                                    <TableCell>Eliminar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {products.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{`Caja ${product.id}`}</TableCell>
                                        <TableCell>{product.loteFabricacion}</TableCell>
                                        <TableCell>{product.fechaExpiacion}</TableCell>
                                        <TableCell>{product.fechaFabric}</TableCell>
                                        <TableCell><CreateIcon /></TableCell>
                                        {/*<TableCell><DeleteIcon /></TableCell>*/}
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
};

export default LoteListado;
