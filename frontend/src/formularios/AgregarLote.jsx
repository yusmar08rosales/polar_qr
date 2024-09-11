import React from "react";
import SimpleBar from "../barras/SimpleBar";
import { TextField, Button, InputLabel, Input } from "@mui/material";

const AgregarLote = () => {

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
                                />
                                <TextField
                                    fullWidth
                                    type='email'
                                    color='primary'
                                    margin='normal'
                                    variant='outlined'
                                    label='Lote de Fabricación'
                                    placeholder='Lote de Fabricación'
                                />
                                <TextField
                                    fullWidth
                                    type='email'
                                    color='primary'
                                    margin='normal'
                                    variant='outlined'
                                    label='Fecha de embarque'
                                    placeholder='Fecha de embarque'
                                />
                                <TextField
                                    fullWidth
                                    type='email'
                                    color='primary'
                                    margin='normal'
                                    variant='outlined'
                                    label='Destino de origen'
                                    placeholder='Destino de origen'
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
                                />
                                <TextField
                                    fullWidth
                                    type='email'
                                    color='primary'
                                    margin='normal'
                                    variant='outlined'
                                    label='Codigo de SENIAT'
                                    placeholder='Codigo de SENIAT'
                                />
                                <TextField
                                    fullWidth
                                    type='email'
                                    color='primary'
                                    margin='normal'
                                    variant='outlined'
                                    label='Fecha de desembarque'
                                    placeholder='Fecha de desembarque'
                                />
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
    )
}
export default AgregarLote;
