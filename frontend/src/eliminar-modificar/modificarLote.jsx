import React, { useState } from "react";
import '../tabla.css';
import Swal from "sweetalert2";
import CreateIcon from '@mui/icons-material/Create';
import { Modal, TextField, Button, InputAdornment } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import DatePicker from "react-datepicker"; // Asegúrate de instalar react-datepicker si no lo tienes
import "react-datepicker/dist/react-datepicker.css";

const ModificarLote = ({ loteId }) => {
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
    const [lotes, setLotes] = useState([]);
    const handleClose = () => setOpen(false);

    const handleManualChangeEmbarque = (event) => {
        setFechaEmbarque(event.target.value);
    };

    const handleManualChangeDesembarque = (event) => {
        setFechaDesembarque(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Implementar lógica de envío aquí
        console.log(values);
        handleClose(); // Cerrar modal después de enviar
    };

    const handleOpen = () => {
        setOpen(true); // Primero, se abre el modal
        cargarDatosLote();  // Después, cargamos los datos del lote
    };
    const cargarDatosLote = async () => {
        try {
            const response = await fetch(`http://localhost:3000/obtenerLote/${loteId}`, {
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
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div className="modale">
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
                                        selected={stringToDate(fechaEmbarque)}
                                        onChange={(date) => {
                                            setFechaEmbarque(date.toLocaleDateString('en-GB').replace(/\//g, '/'));
                                            setFechaEmbarqueDate(date);  // Guardar como objeto Date
                                            setIsDatePickerEmbarqueVisible(false); // Cerrar el calendario después de seleccionar una fecha
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
                                        selected={stringToDate(fechaDesembarque)}
                                        onChange={(date) => {
                                            setFechaDesembarque(date.toLocaleDateString('en-GB').replace(/\//g, '/'));
                                            setFechaDesembarqueDate(date);  // Guardar como objeto Date
                                            setIsDatePickerDesembarqueVisible(false); // Cerrar el calendario después de seleccionar una fecha
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
            </Modal>
        </div>
    );
};

export default ModificarLote;
