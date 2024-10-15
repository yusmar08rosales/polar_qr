import React, { useState, useEffect } from "react";
import axios from "axios";
//componente
import BarraSimple from "../barras/BarraSimple";
import { TextField, InputAdornment, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
//iconos
import CreateIcon from '@mui/icons-material/Create';

//componentes de tabla de los productos
import Swal from "sweetalert2";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null); // Estado para almacenar el usuario seleccionado
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        const fetchHistorial = async () => {
            try {
                const response = await fetch("https://backendpaginaqr-production.up.railway.app/visualizarUsuarios", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al obtener el historial');
                }

                const result = await response.json();
                setUsers(result.user);
            } catch (error) {
                console.error("Error al mostrar el historial:", error);
            }
        };

        fetchHistorial();
        const intervalId = setInterval(() => {
            fetchHistorial();
        }, 10000);

        return () => clearInterval(intervalId);
    }, []);

    const handleClickOpen = (user) => {
        setSelectedUser(user.user); // Guarda solo el nombre de usuario
        console.log("user", user.user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNewPassword('');
        setConfirmPassword('');
    };

    const handleSubmit = async () => {
        if (newPassword !== confirmPassword) {
            Swal.fire({
                title: 'Error!',
                text: 'Las contraseñas no coinciden.',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }
    
        try {
            // Asegúrate de pasar `selectedUser` como userOrEmail
            const response = await axios.post("https://backendpaginaqr-production.up.railway.app/actualizarContrasena", {
                userOrEmail: selectedUser, // Aquí se envía el usuario
                newPassword,
            });
            if (response.data.message === "Contraseña actualizada correctamente.") {
                Swal.fire({
                    title: 'Éxito!',
                    text: 'Contraseña actualizada correctamente.',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 3000
                });
                // Aquí podrías redirigir al usuario o realizar alguna otra acción.
            } else {
                Swal.fire({
                    title: 'Error!',
                    text: response.data.message,
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            Swal.fire({
                title: 'Error!',
                text: 'Error al actualizar la contraseña. Por favor, inténtelo de nuevo.',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            });
        }
        handleClose(); // Cerrar el modal
    };
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
                                            Lista de Usuarios
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((lista, index) => (
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
                                                {lista.user}
                                            </TableCell>
                                            <TableCell>{lista.correo}</TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="password"
                                                    color="primary"
                                                    margin="normal"
                                                    variant="outlined"
                                                    name="password" // Se usa un solo nombre para el input
                                                    id="passwiord"
                                                    value={lista.password}
                                                    InputProps={{
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <CreateIcon onClick={() => handleClickOpen(lista)} style={{ cursor: 'pointer' }} />
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                /></TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </div>
            </div>

            {/* Modal para actualizar contraseña */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <DialogTitle style={{ textAlign: "center", color:"#fff" }}>Actualizar Contraseña</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        type='password'
                        color='primary'
                        margin='normal'
                        variant='outlined'
                        label='Nueva Contraseña'
                        placeholder='Nueva Contraseña'
                        //id="pass"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                        style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
                    />
                    <TextField
                        fullWidth
                        type='password'
                        color='primary'
                        margin='normal'
                        variant='outlined'
                        label='Confirmar Contraseña'
                        placeholder='Confirmar Contraseña'
                        //id="pass"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
                    />
                    <Button
                        color="primary"
                        variant="contained"
                        size="medium"
                        onClick={handleSubmit}>
                        ACEPTAR
                    </Button>
                </DialogContent>
            </Dialog>
        </>
    )
}
export default ListUsers;