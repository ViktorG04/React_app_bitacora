import toast from "react-hot-toast";
import { addIngreso, editEstadoSol } from "../../config/axios";

export const IngresarPersonas = async (personas, idSolicitud) => {
    var data = {};
    var detalle = [];
    var temp, bandera, msj;

    for (const i in personas) {

        temp = parseFloat(personas[i])
        if (temp >= 37) {
            toast.error("El maximo de temperatura permitido es 36.9°")
            bandera = 1;
        } else {
            data = { "idDetalle": i, "temperatura": personas[i] }
            detalle.push(data);
        }

    }
    if (bandera !== 1) {
        try {
            const result = await addIngreso({ "idSolicitud": idSolicitud, "personas": detalle });
            msj = result.data['msj'];

        } catch (error) {
            if (error.request.response !== '') {
                var notificacion = error.request.response.split(":");
                notificacion = notificacion[1].split("}");
                toast.error(notificacion[0]);
            } else {
                toast.error("ERROR NETWORK, no se obtuvo respuesta con el servidor");
            }
        }
    }

    return msj;
};


export const updateEstado = async (idUsuario, idSolicitud, idEstado, history) => {
    var msj;
    try {
        var result = await editEstadoSol({ idUsuario, idSolicitud, idEstado })
        msj = result.data['resultState'];
        if (msj === "fields affected") {
            toast.success("Estado Actualizado");
            setTimeout(() => {
                history.push('../solicitudes');
            }, 2000);
        } else {
            toast.success(result.data['resultState']);
        }

    } catch (error) {
        if (error.request.response !== '') {
            var notificacion = error.request.response.split(":");
            notificacion = notificacion[1].split("}");
            toast.error(notificacion[0]);
        } else {
            toast.error("ERROR NETWORK, no se obtuvo respuesta con el servidor");
        }
    }
};