import React from "react";

//componentes
import { TextField, Button } from "@mui/material";
//iconos
import SimpleBar from "../barras/SimpleBar";

const addProduct = () => {

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
                            <TextField
                                fullWidth
                                autoFocus
                                type='text'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Lote'
                                placeholder='Lote'
                            //value={values.user}
                            //onChange={e => setValues({ ...values, user: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                type='email'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Lote de Fabricación'
                                placeholder='Lote de Fabricación'
                            //value={values.correo}
                            //onChange={e => setValues({ ...values, correo: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                type='email'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Fecha de embarque'
                                placeholder='Fecha de embarque'
                            //value={values.correo}
                            //onChange={e => setValues({ ...values, correo: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                type='email'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Destino de origen'
                                placeholder='Destino de origen'
                            //value={values.correo}
                            //onChange={e => setValues({ ...values, correo: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                type='email'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Número de embarque'
                                placeholder='Número de embarque'
                            //value={values.correo}
                            //onChange={e => setValues({ ...values, correo: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                type='email'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Codigo de SENIAT'
                                placeholder='Codigo de SENIAT'
                            //value={values.correo}
                            //onChange={e => setValues({ ...values, correo: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                type='email'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Fecha de destino'
                                placeholder='Fecha de destino'
                            //value={values.correo}
                            //onChange={e => setValues({ ...values, correo: e.target.value })}
                            />
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
export default addProduct;