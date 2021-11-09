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
            var notificacion = error.request.response.split(":");
            notificacion = notificacion[1].split("}");
            toast.error(notificacion[0]);
        }
    }

    return msj;
};


export const updateEstado = async (idUsuario, idSolicitud, idEstado) => {
    var msj;
    try {
        var result = await editEstadoSol({ idUsuario, idSolicitud, idEstado })
        msj = result.data['resultState'];
        if (msj === "fields affected") {
            toast.success("Estado Actualizado");
        } else {
            toast.success(result.data['resultState']);
        }

    } catch (error) {
        var notificacion = error.request.response.split(":");
        notificacion = notificacion[1].split("}");
        toast.error(notificacion[0]);
    }

};