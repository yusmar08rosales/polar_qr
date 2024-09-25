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
import { TextField, InputAdornment, Button, Tooltip } from "@mui/material";

// Iconos
import SearchIcon from "@mui/icons-material/Search";

const LoteListado = () => {
    const location = useLocation();
    const [products, setProducts] = useState([]);
    const [filtro, setFiltro] = useState("");
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
                console.log('Lote ID enviado al backend:', lote);
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
                console.log('Respuesta recibida del backend:', result.data);

                // Procesar los datos: Convertir la matriz en un arreglo de objetos
                const headers = result.data[0];  // Los encabezados están en la primera fila
                const rows = result.data.slice(1);  // Las filas de datos restantes

                // Convertimos cada fila en un objeto con claves de encabezado
                const formattedData = rows.map(row => {
                    if (row.every(cell => cell === '')) return null;
                    const item = {};
                    headers.forEach((header, index) => {
                        item[header] = row[index];
                    });
                    return item;
                }).filter(item => item !== null);

                setProducts(formattedData);
            } catch (error) {
                console.error("Error al mostrar el historial:", error);
            }
        };
        fetchProducts();
        const intervalId = setInterval(() => {
            fetchProducts();
        }, 1000);

        return () => clearInterval(intervalId);
    }, [lote]);

    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    // Filtrar productos según las claves de los encabezados (asegúrate de usar las claves correctas)
    const productosFiltrados = products.filter(product => {
        return (
            product['Lote de Fabricación']?.toLowerCase().includes(filtro.toLowerCase()) ||
            product['Fecha de Vencimiento']?.toLowerCase().includes(filtro.toLowerCase()) ||
            product['Fecha de Fabricación']?.toLowerCase().includes(filtro.toLowerCase())
        );
    });

    return (
        <div className="container">
            <BarraSimple />
            <div className="list">
                <div className="filtro">
                    <Tooltip title={"Agregar Lote"}>
                        <Button>
                            <EliminarProduct
                                lote={lote}
                            />
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
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {productosFiltrados.map((product, index) => (
                                    <TableRow key={index}>
                                        <TableCell>{product['Item de Lote']}</TableCell>
                                        <TableCell>{product['Lote de Fabricación']}</TableCell>
                                        <TableCell>{product['Fecha de Vencimiento']}</TableCell>
                                        <TableCell>{product['Fecha de Fabricación']}</TableCell>
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
