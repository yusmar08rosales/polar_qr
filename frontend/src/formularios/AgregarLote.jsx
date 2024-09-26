import React, { useState } from "react";
import '../App.scss';
import axios from "axios";
//dependencias
import Swal from "sweetalert2";
import SimpleBar from "../barras/SimpleBar";
import { TextField, Button, InputLabel, InputAdornment, Input } from "@mui/material";
//iconos
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-datepicker"; //calendario
import "react-datepicker/dist/react-datepicker.css";

const AgregarLote = () => {
    //obtencion de nombre de usuario
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Recuperamos el nombre de usuario desde localStorage
    const userName = userInfo?.user;
    //estados
    const [fechaEmbarque, setFechaEmbarque] = useState(''); // Fecha de embarque como texto
    const [fechaDesembarque, setFechaDesembarque] = useState(''); // Fecha de desembarque como texto
    const [fechaEmbarqueDate, setFechaEmbarqueDate] = useState(null);
    const [fechaDesembarqueDate, setFechaDesembarqueDate] = useState(null);
    const [isDatePickerEmbarqueVisible, setIsDatePickerEmbarqueVisible] = useState(false);
    const [isDatePickerDesembarqueVisible, setIsDatePickerDesembarqueVisible] = useState(false);
    const [values, setValues] = useState({ id: '', lote: '', fechaEmbarque: '', origen: '', embarque: '', SENIAT: '', fechaDesembarque: '' });
    const [selectedFile, setSelectedFile] = useState(null); // Estado para el archivo

    const formatFecha = (input) => {
        let cleaned = input.replace(/\D+/g, "");
        if (cleaned.length > 2) {
            cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
        }
        if (cleaned.length > 5) {
            cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5, 9);
        }
        return cleaned;
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

    const handleManualChangeEmbarque = (event) => {
        const inputDate = event.target.value;
        setFechaEmbarque(formatFecha(inputDate));
    };

    const handleManualChangeDesembarque = (event) => {
        const inputDate = event.target.value;
        setFechaDesembarque(formatFecha(inputDate));
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]); // Guardar el archivo seleccionado
    };

    const handleSubmit = async (event) => {
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
    
        // Asegúrate de que las fechas estén correctamente formateadas o que tengan un valor por defecto.
        const formattedEmbarqueDate = fechaEmbarqueDate ? fechaEmbarqueDate.toISOString().split('T')[0] : '';
        const formattedDesembarqueDate = fechaDesembarqueDate ? fechaDesembarqueDate.toISOString().split('T')[0] : '';
    
        const formData = new FormData();
        formData.append('id', values.id);
        formData.append('lote', values.lote);
        formData.append('fechaEmbarque', formattedEmbarqueDate); // Usar la fecha formateada
        formData.append('origen', values.origen);
        formData.append('embarque', values.embarque);
        formData.append('SENIAT', values.SENIAT);
        formData.append('fechaDesembarque', formattedDesembarqueDate); // Usar la fecha formateada
        formData.append('documento', selectedFile); // Añadir el archivo
    
        try {
            const res = await axios.post(`https://backendpaginaqr-production.up.railway.app/registroLote/${userName}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            Swal.fire({
                title: 'Registrado!',
                text: 'Lote registrado con éxito!',
                icon: 'success',
                showConfirmButton: false,
                timer: 3000
            });
        } catch (err) {
            console.error('Error al registrar el lote: ', err);
            Swal.fire({
                title: 'Error!',
                text: 'Hubo un problema al registrar el lote.',
                icon: 'error',
                showConfirmButton: false,
                timer: 3000
            });
        }
    };
    
    return (
        <>
            <div className="Container">
                <div className="botones">
                    <SimpleBar />
                </div>

                <div className="modal">
                    <header className="modal_header">
                        <h2 className="modal_header-title">Agregar Lotes</h2>
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
                                    value={fechaEmbarque}
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
                                    value={fechaDesembarque}
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
                            <div className="file-upload">
                                <InputLabel htmlFor="upload-file">Subir archivo</InputLabel>
                                <Input
                                    type="file"
                                    inputProps={{ accept: ".json, .csv" }}
                                    fullWidth
                                    className="custom-file-input"
                                    color="primary"
                                    onChange={handleFileChange}
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
        </>
    );
}

export default AgregarLote;
