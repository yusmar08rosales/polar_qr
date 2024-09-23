import React, { useEffect, useState } from "react";
import '../tabla.css'

//componentes
import BarraSupe from "../barras/BarraSupe";
import EliminarLote from "../eliminar-modificar/EliminarLote";
import ModificarLote from "../eliminar-modificar/modificarLote";

//dependecias
import { TextField, Button, InputAdornment, Tooltip } from "@mui/material";

//componentes de tabla de los productos
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

//iconos
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";

const ListaLotes = () => {
    const navigate = useNavigate();
    const [lotes, setLotes] = useState([]);
    const [filtro, setFiltro] = useState(""); // Estado para almacenar el valor del filtro

    /*----------------
        BOTONES
    ----------------*/
    //listado de productos
    const handleLote = async (loteId) => {
        navigate('/LoteListado', { state: { loteId: loteId } }); // Pasamos el id del lote en la ruta
    };

    //formulario de lote
    const handleAgregarLote = () => {
        navigate('/registroLote');
    };

    // Función para manejar cambios en el filtro
    const handleFiltroChange = (event) => {
        setFiltro(event.target.value);
    };

    // Filtrar los lotes según el valor del filtro
    const lotesFiltrados = lotes.filter(lote => {
        return (
            lote.lote.toLowerCase().includes(filtro.toLowerCase()) ||
            lote.origen.toLowerCase().includes(filtro.toLowerCase()) ||
            lote.SENIAT.toLowerCase().includes(filtro.toLowerCase()) ||
            lote.embarque.toLowerCase().includes(filtro.toLowerCase())
        );
    });

    useEffect(() => {
        const fechEmbarque = async () => {
            try {
                const response = await fetch("https://backendpaginaqr-production.up.railway.app/visualizarEmbarque", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) {
                    throw new Error('Error al obtener el listado de embarque');
                }
                const result = await response.json();
                setLotes(result.data);
            } catch (error) {
                console.error("Error al mostrar el historial:", error);
            }
        };
        fechEmbarque();
    }, []);

    return (
        <div className="container">
            <BarraSupe />

            <div className="list">
                <div className="filtro">
                    <Tooltip title={"Agregar Lote"}>
                        <Button onClick={handleAgregarLote}>
                            <AddIcon />
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
                                    <TableCell>Fecha de Embarque</TableCell>
                                    <TableCell>Origen</TableCell>
                                    <TableCell>Número de Embarque</TableCell>
                                    <TableCell>Código de SENIAT</TableCell>
                                    <TableCell>Fecha de Desembarque</TableCell>
                                    <TableCell>Modificar</TableCell>
                                    <TableCell>Eliminar</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {lotesFiltrados.map((lote, index) => (
                                    <TableRow key={index}>
                                        <TableCell>
                                            <Button
                                                className="button-product"
                                                onClick={() => handleLote(lote.id)}
                                            >
                                                {`Lote ${lote.id}`}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{lote.lote}</TableCell>
                                        <TableCell>{lote.fechaEmbarque}</TableCell>
                                        <TableCell>{lote.origen}</TableCell>
                                        <TableCell>{lote.embarque}</TableCell>
                                        <TableCell>{lote.SENIAT}</TableCell>
                                        <TableCell>{lote.fechaDesembarque}</TableCell>
                                        <TableCell>
                                            <Button>
                                                <ModificarLote
                                                    loteId={lote.id} 
                                                />
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button>
                                                <EliminarLote
                                                    loteId={lote.id}
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

export default ListaLotes;
