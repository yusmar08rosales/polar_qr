import React, { useState } from "react";
import '../App.scss';
import axios from "axios";
//dependencias
import Swal from "sweetalert2";
import { Modal, TextField, Button, InputLabel, InputAdornment, Input, Tooltip } from '@mui/material';

//iconos
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CreateIcon from '@mui/icons-material/Create';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DatePicker from "react-datepicker"; // Asegúrate de instalar react-datepicker si no lo tienes
import "react-datepicker/dist/react-datepicker.css";

const ModificarLote = ({ loteId }) => {
    //obtencion de nombre de usuario
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Recuperamos el nombre de usuario desde localStorage
    const userName = userInfo?.user;
    //estados
    const [open, setOpen] = useState(false);
    const [values, setValues] = useState({
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
    const [selectedFile, setSelectedFile] = useState(null); // Estado para el archivo
    const [fechaDesembarqueDate, setFechaDesembarqueDate] = useState(null);
    const handleClose = () => setOpen(false);

    const handleManualChangeEmbarque = (event) => {
        setFechaEmbarque(event.target.value);
    };

    const handleManualChangeDesembarque = (event) => {
        setFechaDesembarque(event.target.value);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]); // Guardar el archivo seleccionado
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!selectedFile) {
            Swal.fire({
                title: 'Error!',
                text: 'Por favor, suba un archivo.',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            });
            return;
        }

        const formData = new FormData();
        formData.append('documento', selectedFile);  // Añadir el archivo

        // Añadir los demás campos del formulario
        formData.append('fechaEmbarque', fechaEmbarqueDate ? fechaEmbarqueDate.toISOString().split('T')[0] : '');
        formData.append('fechaDesembarque', fechaDesembarqueDate ? fechaDesembarqueDate.toISOString().split('T')[0] : '');
        formData.append('lote', values.lote);
        formData.append('origen', values.origen);
        formData.append('embarque', values.embarque);
        formData.append('SENIAT', values.SENIAT);

        axios.post(`https://backendpaginaqr-production.up.railway.app/ModificarEmbarque/${loteId}/${userName}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'  // Establecer el encabezado para multipart
            }
        })
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
                    <Tooltip title={"regreso a la tabla de lotes"}>
                        <Button color="inherit" onClick={handleClose}>
                            <ArrowBackIcon />
                        </Button>
                    </Tooltip>
                    <div className="modal">
                        <header className="modal_header">
                            <h2 className="modal_header-title">Modificar Lote</h2>
                        </header>

                        <main className="modal_content">
                            <form onSubmit={handleSubmit}>
                                <div className="form-row">
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

                                    <TextField
                                        fullWidth
                                        type='text'
                                        color='primary'
                                        margin='normal'
                                        variant='outlined'
                                        id="fecha"
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
                                        <div className="datepicker-container3">
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
                                        </div>
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
                                        id="fecha"
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
                                        <div className="datepicker-container2">
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
                                        </div>
                                    )}
                                </div>
                                <div className="file-upload">
                                    <InputLabel htmlFor="upload-file">Subir archivo</InputLabel>
                                    <TextField
                                        type="file"
                                        inputProps={{ accept: ".json, .csv" }}
                                        fullWidth
                                        color="primary"
                                        onChange={handleFileChange}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CloudUploadIcon id="icono" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        variant="outlined"  // Puedes cambiar el estilo del TextField aquí
                                    />
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
