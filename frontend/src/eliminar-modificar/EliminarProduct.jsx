import React, { useState } from "react";
import "../tabla.css"
import Swal from "sweetalert2";
import CreateIcon from '@mui/icons-material/Create';
import { Modal, Input, InputLabel, Button, Box } from "@mui/material";

const EliminarProduct = ({ lote }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Recuperamos el nombre de usuario desde localStorage
    const userName = userInfo?.user;  // Obtenemos el nombre de usuario

    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // Estado para manejar el archivo

    // Funciones para abrir y cerrar el modal
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // Manejador de cambio de archivo
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]); // Guarda el archivo seleccionado
    };

    // Función para manejar la subida de archivo
    const handleFileUpload = async () => {
        if (!selectedFile) {
            Swal.fire('Error', 'Por favor selecciona un archivo', 'error');
            return;
        }
    
        const formData = new FormData();
        formData.append('documento', selectedFile);  // El nombre debe ser 'documento'
        formData.append('lote', lote);  // Agrega el lote
        formData.append('userName', userName);  // Agrega el nombre del usuario
    
        try {
            const response = await fetch(`https://backendpaginaqr-production.up.railway.app/ModificarProduct/${lote}/${userName}`, {
                method: 'POST',
                body: formData,
            });
    
            if (!response.ok) {
                throw new Error('Error al subir el archivo');
            }
    
            Swal.fire('Éxito', 'Archivo subido correctamente', 'success');
            handleClose();  // Cierra el modal después de subir el archivo
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            Swal.fire('Error', 'Hubo un problema al subir el archivo', 'error');
        }
    };
    

    return (
        <>
            <div>
                <CreateIcon onClick={handleOpen} style={{ cursor: 'pointer' }} />

                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="simple-modal-title"
                    aria-describedby="simple-modal-description"
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: 400,
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2
                        }}
                    >
                        <div className="file-upload">
                            <InputLabel htmlFor="upload-file" className="title">Subir archivo</InputLabel>
                            <Input
                                id="upload-file"
                                type="file"
                                inputProps={{ accept: ".json, .csv" }}
                                fullWidth
                                className="title"
                                color="primary"
                                onChange={handleFileChange} // Manejador de archivo
                            />
                        </div>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleFileUpload} // Subir el archivo
                        >
                            Subir Archivo
                        </Button>
                    </Box>
                </Modal>
            </div>
        </>
    );
};

export default EliminarProduct;
