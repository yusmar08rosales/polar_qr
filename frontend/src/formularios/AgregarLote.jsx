import React, { useState } from "react";
import SimpleBar from "../barras/SimpleBar";
import { TextField, Button, InputLabel, InputAdornment, Input } from "@mui/material";

//iconos
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
//DEPENDENCIAS
import DatePicker from "react-datepicker"; //calendario
import "react-datepicker/dist/react-datepicker.css";

const AgregarLote = () => {
    // Estado para las fechas de embarque y desembarque
    const [fechaEmbarque, setFechaEmbarque] = useState(''); // Fecha de embarque como texto
    const [fechaDesembarque, setFechaDesembarque] = useState(''); // Fecha de desembarque como texto

    // Estados para controlar la visibilidad de los DatePicker
    const [isDatePickerEmbarqueVisible, setIsDatePickerEmbarqueVisible] = useState(false);
    const [isDatePickerDesembarqueVisible, setIsDatePickerDesembarqueVisible] = useState(false);

    // Función para formatear la fecha con "/"
    const formatFecha = (input) => {
        let cleaned = input.replace(/\D+/g, ""); // Eliminar todo lo que no sea dígito
        if (cleaned.length > 2) {
            cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2); // Insertar la primera "/"
        }
        if (cleaned.length > 5) {
            cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5, 9); // Insertar la segunda "/"
        }
        return cleaned;
    };

    // Función para convertir fecha de texto a Date (si es posible)
    const stringToDate = (str) => {
        const dateParts = str.split('/');
        if (dateParts.length === 3) {
            const [day, month, year] = dateParts;
            const validDate = new Date(`${year}-${month}-${day}`);
            return isNaN(validDate.getTime()) ? null : validDate; // Si es NaN, la fecha es inválida
        }
        return null;
    };

    // Manejar la entrada manual para la fecha de embarque
    const handleManualChangeEmbarque = (event) => {
        const inputDate = event.target.value;
        setFechaEmbarque(formatFecha(inputDate)); // Formatear la fecha con "/"
    };

    // Manejar la entrada manual para la fecha de desembarque
    const handleManualChangeDesembarque = (event) => {
        const inputDate = event.target.value;
        setFechaDesembarque(formatFecha(inputDate)); // Formatear la fecha con "/"
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
                        <form /*onSubmit={handleSubmit}*/>
                            {/* Agrupar los primeros 4 TextField */}
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
                                    style={{ backgroundColor: '#ffffff4d', borderRadius: '3px'}}
                                />
                                <TextField
                                    fullWidth
                                    type='email'
                                    color='primary'
                                    margin='normal'
                                    variant='outlined'
                                    label='Lote de Fabricación'
                                    placeholder='Lote de Fabricación'
                                    style={{ backgroundColor: '#ffffff4d', borderRadius: '3px'}}
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
                                    style={{ backgroundColor: '#ffffff4d', borderRadius: '3px'}}
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
                                {/* Solo mostrar el DatePicker si el valor actual es una fecha válida */}
                                {isDatePickerEmbarqueVisible && (
                                    <DatePicker
                                        selected={stringToDate(fechaEmbarque)}
                                        onChange={(date) => setFechaEmbarque(date.toLocaleDateString('en-GB').replace(/\//g, '/'))}
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
                                    style={{ backgroundColor: '#ffffff4d', borderRadius: '3px'}}
                                />
                            </div>

                            {/* Agrupar los siguientes 3 TextField */}
                            <div className="form-row">
                                <TextField
                                    fullWidth
                                    type='email'
                                    color='primary'
                                    margin='normal'
                                    variant='outlined'
                                    label='Número de embarque'
                                    placeholder='Número de embarque'
                                    style={{ backgroundColor: '#ffffff4d', borderRadius: '3px'}}
                                />
                                <TextField
                                    fullWidth
                                    type='email'
                                    color='primary'
                                    margin='normal'
                                    variant='outlined'
                                    label='Codigo de SENIAT'
                                    placeholder='Codigo de SENIAT'
                                    style={{ backgroundColor: '#ffffff4d', borderRadius: '3px'}}
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
                                    style={{ backgroundColor: '#ffffff4d', borderRadius: '3px'}}
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
                                {/* Solo mostrar el DatePicker si el valor actual es una fecha válida */}
                                {isDatePickerDesembarqueVisible && (
                                    <DatePicker
                                        selected={stringToDate(fechaDesembarque)}
                                        onChange={(date) => setFechaDesembarque(date.toLocaleDateString('en-GB').replace(/\//g, '/'))}
                                        dateFormat="dd/MM/yyyy"
                                        inline
                                    />
                                )}
                            </div>
                            <div className="file-upload">
                                <InputLabel htmlFor="upload-file">Subir archivo</InputLabel>
                                <Input
                                    id="upload-file"
                                    type="file"
                                    inputProps={{ accept: ".pdf,.doc,.docx,.png,.jpg" }}
                                    fullWidth
                                    className="custom-file-input"
                                    color="primary"
                                />
                            </div>
                            <Button
                                color="primary"
                                className="boton-esp"
                                variant="contained"
                                size="large"
                                type="submit">
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
