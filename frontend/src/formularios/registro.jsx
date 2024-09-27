import React, { useEffect, useState } from "react";
import '../App.scss';
import axios from "axios";
//dependencias
import Swal from "sweetalert2";
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, Toolbar, AppBar } from "@mui/material";

//componentes
import SimpleBar from "../barras/SimpleBar";
//iconos

const Registro = () => {
    const [values, setValues] = useState({ user: '', password: '', correo: '', role: '' });
    const [objRoles, setObjRoles] = useState([]);
    const [products, setProducts] = useState([]);
    const [open, setOpen] = useState(false);

    const getRoles = async () => {
        axios.get(`https://backendpaginaqr-production.up.railway.app/roles`)
            .then(res => {
                setObjRoles(res.data.objData);
            });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (!validatePassword(values.password)) {
            Swal.fire({
                title: 'Error!',
                text: 'La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        if (values.user === '' || values.password === '' || values.correo === '' || values.role === '') {
            Swal.fire(
                {
                    title: 'Error!',
                    text: 'Por favor, complete todos los campos del formulario y asegúrese de seleccionar la cantidad correcta de productos.',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                }
            );
            return;
        }
        axios.post('https://backendpaginaqr-production.up.railway.app/registro', values)
            .then(res => {
                Swal.fire(
                    {
                        title: 'Registrado!',
                        text: 'Usuario registrado con éxito!',
                        icon: 'success',
                        showConfirmButton: false,
                        timer: 3000
                    }
                );
            })
            .catch(err => {
                console.error('Error al registrar usuarios: ', err);
                Swal.fire(
                    {
                        title: 'Error!',
                        text: 'Hubo un problema al registrar el Usuario.',
                        icon: 'error',
                        showConfirmButton: false,
                        timer: 3000
                    }
                );
            })
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return passwordRegex.test(password);
    };

    useEffect(() => {
        getRoles();
    }, []);

    useEffect(() => {
        if (values.role === 'admin') {
            setValues(prevState => ({ ...prevState }));
        } else if (values.role) {
            setValues(prevState => ({ ...prevState }));
            setOpen(true);
        } else {
            setOpen(false);
        }
    }, [values.role, products]);

    return (
        <>
            <div className="Container">
                <div className="botones">
                    <SimpleBar />
                </div>


                <div className="modal">
                    <header className="modal_header">
                        <h2 className="modal_header-title">REGISTRAR</h2>
                    </header>

                    <main className="modal_content">
                        <form onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                autoFocus
                                type='text'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Usuario'
                                placeholder='Usuario'
                                value={values.user}
                                style={{ backgroundColor: '#ffffff4d', borderRadius: '3px'}}
                                onChange={e => setValues({ ...values, user: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                type='password'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Contraseña'
                                placeholder='Contraseña'
                                value={values.password}
                                style={{ backgroundColor: '#ffffff4d', borderRadius: '3px'}}
                                onChange={e => setValues({ ...values, password: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                type='email'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Correo'
                                placeholder='Correo'
                                value={values.correo}
                                style={{ backgroundColor: '#ffffff4d', borderRadius: '3px'}}
                                onChange={e => setValues({ ...values, correo: e.target.value })}
                            />
                            <FormControl fullWidth>
                                <InputLabel>Rol</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    value={values.role}
                                    style={{ backgroundColor: '#ffffff4d', borderRadius: '3px', color: '#fff'}}
                                    label="Rol"
                                    onChange={e => setValues({ ...values, role: e.target.value })}
                                >
                                    {objRoles.map((value, index) => (
                                        <MenuItem key={index} value={value.rol}>{value.rol}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </form>
                    </main>

                    <footer className="modal_footer">
                        <Button
                            color="primary"
                            className="boton-esp"
                            variant="contained"
                            size="large"
                            onClick={handleSubmit}>
                            ACEPTAR
                        </Button>
                    </footer>
                </div>
            </div>
        </>
    );
};

export default Registro;
