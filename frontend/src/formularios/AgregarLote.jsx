import React, { useState } from "react";
import SimpleBar from "../barras/SimpleBar";
import { TextField, Button, InputLabel, InputAdornment, Input } from "@mui/material";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import DatePicker from "react-datepicker"; //calendario
import "react-datepicker/dist/react-datepicker.css";

const AgregarLote = () => {
    const [fechaEmbarque, setFechaEmbarque] = useState(''); // Fecha de embarque como texto
    const [fechaDesembarque, setFechaDesembarque] = useState(''); // Fecha de desembarque como texto
    const [isDatePickerEmbarqueVisible, setIsDatePickerEmbarqueVisible] = useState(false);
    const [isDatePickerDesembarqueVisible, setIsDatePickerDesembarqueVisible] = useState(false);

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

    const handleDateChangeEmbarque = (date) => {
        date.setHours(12, 0, 0, 0); // Asegurar que la hora sea el mediodía
        setFechaEmbarque(date.toLocaleDateString('en-GB').replace(/\//g, '/'));
        setIsDatePickerEmbarqueVisible(false); // Cerrar el calendario al seleccionar la fecha
    };

    const handleDateChangeDesembarque = (date) => {
        date.setHours(12, 0, 0, 0); // Asegurar que la hora sea el mediodía
        setFechaDesembarque(date.toLocaleDateString('en-GB').replace(/\//g, '/'));
        setIsDatePickerDesembarqueVisible(false); // Cerrar el calendario al seleccionar la fecha
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
                        <form>
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
