import React, { useState } from "react";
//componentes
import '../App.scss';
import { TextField, Button } from "@mui/material";
import axios from "axios";
import SimpleBar from "../barras/SimpleBar";
//iconos
import Swal from "sweetalert2";

const Desbloqueo = () => {
    const [values, setValues] = useState({ user: '', correo: '' });
    const [codigo, setCodigo] = useState({ digito1: '', digito2: '', digito3: '', digito4: '', digito5: '', digito6: '' });
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [step, setStep] = useState(1);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (step === 1) {
            if (values.user === '' || values.correo === '') {
                Swal.fire({
                    title: 'Error!',
                    text: 'Por favor, complete todos los campos del formulario.',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                });
                return;
            }

            try {
                const response = await axios.post("http://localhost:3000/validacion", {
                    user: values.user,
                    correo: values.correo,
                });
                if (response.data.Message === "Código de verificación enviado al correo.") {
                    setStep(2);
                }
            } catch (error) {
                console.error('Error al enviar el código: ', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Usuario inválido.',
                    icon: 'error',
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        } else if (step === 2) {
            verificarCodigo();
        } else if (step === 3) {
            actualizarContraseña();
        }
    };

    const verificarCodigo = async () => {
        const codigoCompleto = Object.values(codigo).join("");
        try {
            const response = await axios.post("http://localhost:3000/verificarCodigo", {
                user: values.user,
                codigo: codigoCompleto,
            });

            if (response.data.message === "Código verificado correctamente.") {
                setStep(3);
            } else if (response.data.message === "Cuenta bloqueada. Intente de nuevo más tarde.") {
                Swal.fire({
                    icon: 'error',
                    title: 'Usuario Bloqueado',
                    text: 'Cuenta bloqueada. Intente de nuevo más tarde.',
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: response.data.message,
                });
                setCodigo({
                    digito1: "",
                    digito2: "",
                    digito3: "",
                    digito4: "",
                    digito5: "",
                    digito6: "",
                });
            }
        } catch (error) {
            console.error("Error al verificar el código:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al verificar el código. Por favor, inténtelo de nuevo.',
            });
        }
    };

    const actualizarContraseña = async () => {
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
            const response = await axios.post("http://localhost:3000/actualizarContrasena", {
                user: values.user,
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
    };

    const handleCodigoChange = (event) => {
        const { name, value } = event.target;
        if (/^\d?$/.test(value)) {
            setCodigo((prev) => ({ ...prev, [name]: value }));
            if (value) {
                const nextDigit = parseInt(name.charAt(name.length - 1), 10) + 1;
                if (nextDigit <= 6)
                    document.querySelector(`input[name=digito${nextDigit}]`)?.focus();
            }
        }
    };

    const handleKeyDown = (event) => {
        const { name, value } = event.target;

        if (event.key === 'Enter') {
            handleSubmit(event);
        } else if (event.key === 'Backspace' && !value) {
            const prevDigitIndex = parseInt(name.replace('digito', ''), 10) - 1;
            if (prevDigitIndex >= 1) {
                const prevDigitName = `digito${prevDigitIndex}`;
                document.querySelector(`input[name=${prevDigitName}]`)?.focus();
            }
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
                        <h2 className="modal_header-title">Desbloquear Usuario</h2>
                    </header>

                    {step === 1 && (
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
                                    onChange={e => setValues({ ...values, user: e.target.value })}
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
                                    onChange={e => setValues({ ...values, correo: e.target.value })}
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
                    )}

                    {step === 2 && (
                        <main className="modal_content">
                            <p className="texto">
                                Se acaba de enviar a tu correo{" "}
                                <b className="correo">{values.correo}</b> el codigo de verificación,
                                por favor ingresalo a continuación:
                            </p>
                            {[1, 2, 3, 4, 5, 6].map((index) => (
                                <input
                                    className="input-linea"
                                    key={`digito${index}`}
                                    type="tel"
                                    margin="normal"
                                    variant="outlined"
                                    name={`digito${index}`}
                                    value={codigo[`digito${index}`]}
                                    onChange={handleCodigoChange}
                                    onKeyDown={handleKeyDown}
                                />
                            ))}
                            <Button
                                color="primary"
                                className="boton-esp"
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}>
                                ACEPTAR
                            </Button>
                        </main>
                    )}

                    {step === 3 && (
                        <main className="modal_content">
                            <TextField
                                fullWidth
                                type='password'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Contraseña'
                                placeholder='Contraseña'
                                value={values.password}
                                onChange={e => setNewPassword(e.target.value)}
                            />
                            <TextField
                                fullWidth
                                type='password'
                                color='primary'
                                margin='normal'
                                variant='outlined'
                                label='Contraseña'
                                placeholder='Contraseña'
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                            <Button
                                color="primary"
                                className="boton-esp"
                                variant="contained"
                                size="large"
                                onClick={handleSubmit}>
                                ACEPTAR
                            </Button>
                        </main>
                    )}
                </div>
            </div>
        </>
    );
};
export default Desbloqueo;
