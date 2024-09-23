import React from "react";
import Swal from "sweetalert2";
import DeleteIcon from '@mui/icons-material/Delete';

const EliminarProduct = ({ lote }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')); // Recuperamos el nombre de usuario desde localStorage
    const userName = userInfo?.user;  // Obtenemos el nombre de usuario
    
    const handleDelete = async () => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar',
            heightAuto: false,
        });

        if (isConfirmed) {
            try {
                const url = `https://backendpaginaqr-production.up.railway.app/EliminarProduct/${lote}/${userName}`;                
                const response = await fetch(url, { method: 'DELETE' });
                if (!response.ok) {
                    throw new Error(`Error: ${response.statusText}`);
                }
                const data = await response.json();
                if (data.success) {
                    Swal.fire(
                        'Eliminado!',
                        'El lote ha sido eliminado.',
                        'success'
                    );
                } else {
                    throw new Error(data.message || 'Error al eliminar el campo de todos los suscriptores');
                }
            } catch (error) {
                console.error("Error al eliminar el lote:", error);
                Swal.fire(
                    'Error!',
                    'Hubo un problema al eliminar el lote.',
                    'error'
                );
            }
        }
    };

    return (
        <>
            <div onClick={handleDelete}>
                <DeleteIcon />
            </div>
        </>
    );
};

export default EliminarProduct;
