import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

// Componentes
import BarraSimple from "../barras/BarraSimple";
import EliminarProduct from "../eliminar-modificar/EliminarProduct";

// Componentes de tabla
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

// Dependencias
import { TextField, InputAdornment, Button } from "@mui/material";

// Iconos
import SearchIcon from "@mui/icons-material/Search";
import CreateIcon from '@mui/icons-material/Create';

const LoteListado = () => {
    //estados
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filtro, setFiltro] = useState(""); // Estado para el texto del filtro
    const [lote, setLote] = useState("");
    const [llamada, setLlamada] = useState(false);

    useEffect(() => {
        if (location.state && location.state.loteId && !llamada) {
            const loteId = location.state.loteId;
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
            if (!lote) return;
            try {
                const response = await fetch("https://backendpaginaqr-production.up.railway.app/visualizarProductos", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ loteId: lote })
                });
                if (!response.ok) {
                    throw new Error('Error al obtener los productos del lote');
                }
                const result = await response.json();
                setProducts(result.data);
            } catch (error) {
                console.error("Error al mostrar el historial:", error);
            }
        };
        fetchProducts();
    }, [lote]);

    // Manejar cambios en el filtro
    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    // Filtrar los productos según el texto del filtro
    const productosFiltrados = products.filter(product => {
        return (
            product.loteFabricacion.toLowerCase().includes(filtro.toLowerCase()) ||
            product.fechaExpiacion.toLowerCase().includes(filtro.toLowerCase()) ||
            product.fechaFabric.toLowerCase().includes(filtro.toLowerCase())
        );
    });

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
                        value={filtro}
                        onChange={handleFiltroChange}
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
                                {productosFiltrados.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{`Caja ${product.id}`}</TableCell>
                                        <TableCell>{product.loteFabricacion}</TableCell>
                                        <TableCell>{product.fechaExpiacion}</TableCell>
                                        <TableCell>{product.fechaFabric}</TableCell>
                                        <TableCell><CreateIcon /></TableCell>
                                        <TableCell>
                                            <Button>
                                                <EliminarProduct
                                                    lote={product.loteFabricacion}
                                                />
                                            </Button>
                                        </TableCell>
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
