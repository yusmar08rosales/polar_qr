import React, { useEffect, useState } from "react";
import '../tabla.css'

//componentes
import BarraSimple from "../barras/BarraSimple";

//componentes de tabla de los productos
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const History = () => {
    // Estado 
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                const response = await fetch("http://localhost:3000/visualizarHistorico", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener el historial');
                }

                const result = await response.json();
                setHistory(result.data); 
            } catch (error) {
                console.error("Error al mostrar el historial:", error);
            }
        };

        fetchHistorial(); 
    }, []); 

    return (
        <>
            <div className="container">
                <BarraSimple />

                <div className="list">
                    <div className="table">

                        <TableContainer component={Paper} sx={{
                            borderRadius: '10px',
                            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                            padding: '20px',
                            marginTop: '20px',
                        }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{
                                            fontWeight: 'bold',
                                            fontSize: '1.2rem',
                                            borderBottom: '2px solid #1976d2',
                                            color: '#1976d2',
                                        }}>
                                            Historial de Acciones
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map((registro, index) => (
                                        <TableRow key={index}>
                                            <TableCell
                                                sx={{
                                                    fontSize: '1rem',
                                                    padding: '16px',
                                                    borderBottom: '1px solid #ddd',
                                                    position: 'relative',
                                                    paddingLeft: '40px', 
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        position: 'absolute',
                                                        left: '16px',
                                                        top: '50%',
                                                        transform: 'translateY(-50%)',
                                                        width: '10px',
                                                        height: '10px',
                                                        backgroundColor: '#1976d2',
                                                        borderRadius: '50%',
                                                        display: 'inline-block',
                                                    }}
                                                ></span>
                                                {registro.user}
                                            </TableCell>
                                            <TableCell>{registro.accion}</TableCell>
                                            <TableCell>{registro.documento}</TableCell>
                                            <TableCell>{registro.dateFormat}</TableCell>
                                            <TableCell>{registro.date}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>
        </>
    );
};

export default History;
