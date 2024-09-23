import React, { useState } from "react";
import '../App.scss';
import axios from "axios";
import Swal from "sweetalert2";
import CreateIcon from '@mui/icons-material/Create';
import { Modal, TextField, Button, InputAdornment } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DatePicker from "react-datepicker"; // Asegúrate de instalar react-datepicker si no lo tienes
import "react-datepicker/dist/react-datepicker.css";

const ModificarLote = ({ loteId }) => {
    //obtencion de nombre de usuario
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Recuperamos el nombre de usuario desde localStorage
    const userName = userInfo?.user;
    //estados
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({
        id: '',
        lote: '',
        fechaEmbarque: '',
        origen: '',
        embarque: '',
        SENIAT: '',
        fechaDesembarque: '',
    });
    const [fechaEmbarque, setFechaEmbarque] = useState("");
    const [fechaDesembarque, setFechaDesembarque] = useState("");
    const [isDatePickerEmbarqueVisible, setIsDatePickerEmbarqueVisible] = useState(false);
    const [isDatePickerDesembarqueVisible, setIsDatePickerDesembarqueVisible] = useState(false);
    const [fechaEmbarqueDate, setFechaEmbarqueDate] = useState(null);
    const [fechaDesembarqueDate, setFechaDesembarqueDate] = useState(null);
    const handleClose = () => setOpen(false);

    const handleManualChangeEmbarque = (event) => {
        setFechaEmbarque(event.target.value);
    };

    const handleManualChangeDesembarque = (event) => {
        setFechaDesembarque(event.target.value);
    };

    const stringToDate = (str) => {
        const dateParts = str.split('/');
        if (dateParts.length === 3) {
            const [day, month, year] = dateParts;
            const validDate = new Date(`${year}-${month}-${day}`);
            return isNaN(validDate.getTime()) ? null : validDate;
        }
        return null;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formattedValues = {
            ...values,
            fechaEmbarque: fechaEmbarqueDate ? fechaEmbarqueDate.toISOString().split('T')[0] : '',
            fechaDesembarque: fechaDesembarqueDate ? fechaDesembarqueDate.toISOString().split('T')[0] : ''
        };

        if (Object.values(formattedValues).some(value => value === '')) {
            Swal.fire({
                title: 'Error!',
                text: 'Por favor, complete todos los campos del formulario.',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        axios.post(`https://backendpaginaqr-production.up.railway.app/ModificarEmbarque/${loteId}/${userName}`, formattedValues)
            .then(res => {
                Swal.fire({
                    title: 'Registrado!',
                    text: 'Lote registrado con éxito!',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 3000
                });
            })
            .catch(err => {
                console.error('Error al registrar el lote: ', err);
                Swal.fire({
                    title: 'Error!',
                    text: 'Hubo un problema al registrar el lote.',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                });
            });
        handleClose(); // Cerrar modal después de enviar
    };

    const handleOpen = () => {
        setOpen(true); // Primero, se abre el modal
        cargarDatosLote();  // Después, cargamos los datos del lote
    };
    const cargarDatosLote = async () => {
        try {
            const response = await fetch(`https://backendpaginaqr-production.up.railway.app/obtenerLote/${loteId}`, {
                method: 'POST', // Asegúrate de que el método HTTP es el correcto
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) {
                throw new Error('Error al obtener los datos del lote');
            }
            const result = await response.json();
            // Actualizar el estado con los datos obtenidos
            if (result.data) {
                setValues({
                    id: result.data.id,
                    lote: result.data.lote,
                    fechaEmbarque: result.data.fechaEmbarque,
                    origen: result.data.origen,
                    embarque: result.data.embarque,
                    SENIAT: result.data.SENIAT,
                    fechaDesembarque: result.data.fechaDesembarque,
                });
                // Más actualizaciones de estado según necesidad
            }
        } catch (error) {
            console.error("Error al cargar datos del lote:", error);
            Swal.fire('Error', 'No se pudo cargar los datos del lote', 'error');
        }
    }

    return (
        <div>
            <CreateIcon onClick={handleOpen} style={{ cursor: 'pointer' }} />

            <Modal
                open={open}
                onClose={handleClose}
            >
                <div className="Container">
                    <div className="modal">
                        <header className="modal_header">
                            <h2 className="modal_header-title">Modificar Lote</h2>
                        </header>

                        <main className="modal_content">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
                                    <TextField
                                        fullWidth
                                        autoFocus
                                        type='text'
                                        color='primary'
                                        margin='normal'
                                        variant='outlined'
                                        label='Lote'
                                        placeholder='Lote'
                                        style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
                                        value={values.id}
                                        onChange={e => setValues({ ...values, id: e.target.value })}
                                    />
                                    <TextField
                                        fullWidth
                                        type='email'
                                        color='primary'
                                        margin='normal'
                                        variant='outlined'
                                        label='Lote de Fabricación'
                                        placeholder='Lote de Fabricación'
                                        style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
                                        value={values.lote}
                                        onChange={e => setValues({ ...values, lote: e.target.value })}
                                    />

                                    {/* Fecha de embarque con entrada manual y calendario */}
                                    <TextField
                                        fullWidth
                                        type='text'
                                        color='primary'
                                        margin='normal'
                                        variant='outlined'
                                        label='Fecha de embarque'
                                        value={values.fechaEmbarque}
                                        style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
                                        onChange={handleManualChangeEmbarque}
                                        placeholder='DD/MM/AAAA'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthIcon onClick={() => setIsDatePickerEmbarqueVisible(!isDatePickerEmbarqueVisible)} style={{ cursor: 'pointer' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {isDatePickerEmbarqueVisible && (
                                        <DatePicker
                                            selected={fechaEmbarqueDate}  // Usa el estado de la fecha como objeto Date
                                            onChange={(date) => {
                                                const formattedDate = date.toLocaleDateString('en-GB').replace(/\//g, '/'); // Formato DD/MM/AAAA
                                                setFechaEmbarque(formattedDate);  // Actualiza el valor de la fecha de embarque en string
                                                setValues({ ...values, fechaEmbarque: formattedDate });  // Actualiza el campo de fecha en values
                                                setFechaEmbarqueDate(date);  // Guarda el objeto Date en el estado
                                                setIsDatePickerEmbarqueVisible(false);  // Cierra el calendario
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            inline
                                        />
                                    )}

                                    <TextField
                                        fullWidth
                                        type='email'
                                        color='primary'
                                        margin='normal'
                                        variant='outlined'
                                        label='Destino de origen'
                                        placeholder='Destino de origen'
                                        style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
                                        value={values.origen}
                                        onChange={e => setValues({ ...values, origen: e.target.value })}
                                    />
                                </div>

                                <div className="form-row">
                                    <TextField
                                        fullWidth
                                        type='email'
                                        color='primary'
                                        margin='normal'
                                        variant='outlined'
                                        label='Número de embarque'
                                        placeholder='Número de embarque'
                                        style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
                                        value={values.embarque}
                                        onChange={e => setValues({ ...values, embarque: e.target.value })}
                                    />
                                    <TextField
                                        fullWidth
                                        type='email'
                                        color='primary'
                                        margin='normal'
                                        variant='outlined'
                                        label='Codigo de SENIAT'
                                        placeholder='Codigo de SENIAT'
                                        style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
                                        value={values.SENIAT}
                                        onChange={e => setValues({ ...values, SENIAT: e.target.value })}
                                    />

                                    {/* Fecha de desembarque con entrada manual y calendario */}
                                    <TextField
                                        fullWidth
                                        type='text'
                                        color='primary'
                                        margin='normal'
                                        variant='outlined'
                                        label='Fecha de desembarque'
                                        value={values.fechaDesembarque}
                                        style={{ backgroundColor: '#ffffff4d', borderRadius: '3px' }}
                                        onChange={handleManualChangeDesembarque}
                                        placeholder='DD/MM/AAAA'
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarMonthIcon onClick={() => setIsDatePickerDesembarqueVisible(!isDatePickerDesembarqueVisible)} style={{ cursor: 'pointer' }} />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />
                                    {isDatePickerDesembarqueVisible && (
                                        <DatePicker
                                            selected={fechaDesembarqueDate}  // Usa el estado de la fecha como objeto Date
                                            onChange={(date) => {
                                                const formattedDate = date.toLocaleDateString('en-GB').replace(/\//g, '/');
                                                setFechaDesembarque(formattedDate);  // Actualiza el valor de la fecha de desembarque en string
                                                setValues({ ...values, fechaDesembarque: formattedDate });  // Actualiza el campo de fecha en values
                                                setFechaDesembarqueDate(date);  // Guarda el objeto Date en el estado
                                                setIsDatePickerDesembarqueVisible(false);  // Cierra el calendario
                                            }}
                                            dateFormat="dd/MM/yyyy"
                                            inline
                                        />
                                    )}
                                </div>
                                <Button
                                    color="primary"
                                    className="boton-esp"
                                    variant="contained"
                                    size="large"
                                    type="submit"
                                    onClick={handleSubmit}>
                                    ACEPTAR
                                </Button>
                            </form>
                        </main>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModificarLote;
