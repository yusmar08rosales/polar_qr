import React from "react";
//icono
import DeleteIcon from '@mui/icons-material/Delete';

const EliminarLote = () => {
    const handleDelete = async () => {
        const { isConfirmed } = await Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción no se puede deshacer",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar!',
            cancelButtonText: 'Cancelar'
        });

        if (isConfirmed) {
            try {
                console.log("Entrando a borrar embarque: ",);
                const url = `http://localhost:3000/EliminarEmbarque`;
                const response = await fetch(url);
                const data = await response.json();
                console.log(data);
                if (data.success) {
                    Swal.fire(
                        'Eliminado!',
                        'El hilo ha sido eliminado.',
                        'success'
                    );
                } else {
                    throw new Error(data.message || 'Error al eliminar el suscriptor en el backend');
                }
            } catch (error) {
                console.error("Error al eliminar el usuario:", error.response ? error.response.data : error);
                Swal.fire(
                    'Error!',
                    'Hubo un problema al eliminar el hilo.',
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
    )

}
export default EliminarLote