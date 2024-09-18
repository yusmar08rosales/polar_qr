import React, { useState } from "react";
import '../tabla.css'

//componentes
import BarraSupe from "../barras/BarraSupe";

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
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";

const ListaLotes = () => {
    const navigate = useNavigate();

    // Estado para los lotes
    const [lotes, setLotes] = useState([
        {
            id: 1,
            loteFabricacion: 'A65BF9NH',
            fechaEmbarque: '23 de Feb. de 2024',
            origen: 'Holanda',
            numeroEmbarque: '346598',
            codigoSeniat: '34b87uy2',
            fechaDesembarque: '15 de Marz. de 2024',
        },
        {
            id: 2,
            loteFabricacion: '564F98H',
            fechaEmbarque: '30 de Abr. de 2024',
            origen: 'España',
            numeroEmbarque: '787783',
            codigoSeniat: 'u67yu789',
            fechaDesembarque: '15 de May. de 2024',
        }
    ]);

    const handleLote = () => {
        navigate('/LoteListado')
    }

    const handleAgregarLote = () => {
        navigate('/registroLote');
    }
    return (
        <>
            <div className="container">
                <BarraSupe />

                <div className="list">
                    <div className="filtro">
                        <Tooltip title={"agregar lote"}>
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
                                        <TableCell>Modificar</TableCell>
                                        <TableCell>Eliminar</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {lotes.map((lote) => (
                                        < TableRow key={lote.id} >
                                            <TableCell>
                                                <Button className="button-product" onClick={handleLote}>
                                                    {`Lote ${lote.id}`}
                                                </Button>
                                            </TableCell>
                                            <TableCell>{lote.loteFabricacion}</TableCell>
                                            <TableCell>{lote.fechaEmbarque}</TableCell>
                                            <TableCell>{lote.origen}</TableCell>
                                            <TableCell>{lote.numeroEmbarque}</TableCell>
                                            <TableCell>{lote.codigoSeniat}</TableCell>
                                            <TableCell>{lote.fechaDesembarque}</TableCell>
                                            <TableCell>
                                                <CreateIcon />
                                            </TableCell>
                                            <TableCell>
                                                <DeleteIcon />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div >
        </>
    );
};
export default ListaLotes;