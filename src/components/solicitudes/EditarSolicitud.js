import React, { useState, useEffect, useContext } from 'react';
import { MenuItem, FormGroup, FormControl, Button, makeStyles, Typography, Table, TableCell, TableBody } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { buscarSolicitudes, editSolicitud, getOficinas, getEstados, editEstadoSol } from '../../config/axios';
import { useHistory, useParams } from "react-router-dom";
import UserLoginContext from '../../context/login/UserLoginContext';
import decrypt from '../../utils/decrypt';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';
import { Stack } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'

const initialValue = {
    fechaVisita: '',
    motivo: '',
    idSolicitud: '',
    idArea: '',
    idEstado: '',
}

const initialDataPerson = {
    idDetalle: '',
    nombreCompleto: '',
    docIdentidad: '',
    sintomas: '',
    diagnosticado: '',
    covidFamiliar: '',
    viajo: ''
}

const useStyles = makeStyles({
    container: {
        width: '50%',
        margin: '4% 0 0 2%',
        '& > *': {
            marginTop: '12px'
        }
    }
})

const EditarSolicitud = () => {
    const [solicitud, setSolicitud] = useState(initialValue);
    const [persona, setPersona] = useState(initialDataPerson);
    const [fechaI, setValueFI] = useState(new Date());
    const [areas, setAreas] = useState([]);
    const [estados, setEstados] = useState([]);
    const [state, setState] = useState(false);
    const [action, setAction] = useState(true);
    const [actionButton, setActionButton] = useState(true);
    const [name, setName] = useState('REGRESAR');
    const { motivo, idArea, idEstado } = solicitud;
    const [datosActuales, setDatosActuales] = useState(initialValue);

    //datos guardados en Localstorage
    const userStateEncrypt = useContext(UserLoginContext);
    const userStore = JSON.parse(decrypt(userStateEncrypt.userLogin));

    const { id } = useParams();
    const classes = useStyles();

    const history = useHistory();

    const onValueChange = (e) => {
        setSolicitud({ ...solicitud, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        async function loadSolicitudDetails() {
            const response = await buscarSolicitudes(id);

            delete response.data['empresa'];
            delete response.data['estado'];
            delete response.data['nombreCompleto'];

            setPersona(response.data['personas'][0]);
            delete response.data['personas'];

            setSolicitud(response.data);
            setDatosActuales(response.data);
            setValueFI(response.data['fechaVisita'])


            var data = [];
            const result = await getEstados();

            if (response.data['idEstado'] === 3) {

                data.push(result.data[2]);
                data.push(result.data[7]);

                if (userStore.idRol === 1) {
                    data.push(result.data[3]);
                    data.push(result.data[4]);
                }
                setAction(false)
                setActionButton(false);
                setName("CANCELAR")
            } else if (response.data['idEstado'] === 4) {
                data.push(result.data[3]);
                data.push(result.data[7]);
                setName("CANCELAR")
                setAction(false);
                setActionButton(false);
                setState(true);

            } else if (response.data['idEstado'] === 5) {
                data.push(result.data[4]);
                setState(true);
            } else if (response.data['idEstado'] === 6) {
                data.push(result.data[5]);
                setState(true);
            }
            else if (response.data['idEstado'] === 7) {
                data.push(result.data[6]);
                setState(true);
            }
            else if (response.data['idEstado'] === 8) {
                data.push(result.data[7]);
                setState(true);
            } else {
                delete result.data[0];
                delete result.data[1];
            }
            setEstados(data);
        };
        loadSolicitudDetails();

        async function getAllOficinas() {
            const response = await getOficinas();
            for (const i in response.data) {
                if (response.data[i]['idEstado'] === 2) {
                    delete response.data[i]
                }
            }
            setAreas(response.data);
        };
        getAllOficinas();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const editSolicitudDetails = async () => {

        var resultFech, estado;

        if (solicitud['idEstado'] !== datosActuales['idEstado']) {
            if (idEstado === 4) {
                estado = "APROBAR"
            } else if (idEstado === 5) {
                estado = "RECHAZAR"
            } else {
                estado = "CANCELAR"
            }
            toast((t) => (

                <span>
                    <h3><b>HA SELECCIONADO {estado} LA SOLICITUD</b></h3>
                    ¿Esta seguro de querer realizar esta accion?
                    <Stack spacing={2} direction="row">
                        <button onClick={() => updateEstado(userStore.idUsuario, solicitud['idSolicitud'], solicitud['idEstado'])}>SI </button>
                        <button onClick={() => toast.dismiss(t.id)}>NO</button>
                    </Stack>
                </span >
            ));
        } else {

            resultFech = await validarHorayFecha(fechaI, solicitud['fechaVisita']);
            if (resultFech !== "iguales") {
                solicitud['fechaVisita'] = resultFech;
            } else {
                solicitud['fechaVisita'] = fechaI;
            }

            if (motivo.trim() === "") {
                toast.error("Campo Requerido! Ingrese el motivo de la visita")
            } else if (solicitud['fechaVisita'] !== undefined) {

                if (solicitud['motivo'] !== datosActuales['motivo'] || solicitud['idArea'] !== datosActuales['idArea']
                    || resultFech !== "iguales") {
                    delete solicitud['idEstado'];
                    delete solicitud['idUsuario'];
                    try {
                        await editSolicitud(solicitud);
                        toast.success("Solicitud Actualizada")
                        setTimeout(() => {
                            history.push('../solicitudes');
                        }, 2000);
                    } catch (error) {
                        if (error.request.response !== '') {
                            var notificacion = error.request.response.split(":");
                            notificacion = notificacion[1].split("}");
                            toast.error(notificacion[0]);
                        } else {
                            toast.error("ERROR NETWORK, no se obtuvo respuesta con el servidor");
                        }
                    }
                } else {
                    toast.success("No se aplico ningun cambio");
                }//enviar datos api
            }//valir rango de horas y campo motivo vacio
        }//actualizar si el estado no cambio
    };


    async function validarHorayFecha(cambio, actual) {
        var time, fechaIngreso, returnFecha;

        if (cambio !== actual) {
            time = cambio.getHours() + ':' + cambio.getMinutes() + ':00';
            if (time >= '17:00:00' && time <= '7:59:00') {
                toast.error("La hora de ingreso solo es valida entre las 08:00 AM y las 05:00 PM");
            } else {
                fechaIngreso = fechaI.toISOString().substr(0, 10);
                returnFecha = fechaIngreso.split("-").reverse().join("-") + ' ' + time;
            }
        } else {
            returnFecha = "iguales";
        }
        return returnFecha;
    };

    async function updateEstado(idUsuario, idSolicitud, idEstado) {

        try {
            var result = await editEstadoSol({ idUsuario, idSolicitud, idEstado })

            if (result.data['resultState'] === "fields affected") {
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

    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <FormGroup className={classes.container}>
                <div><Toaster /></div>
                <Typography align="center" variant="h4">Solicitud N°{solicitud.idSolicitud}</Typography>
                <Box component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '33ch' },
                    }}
                    noValidate
                    autoComplete="off">
                    <TextField
                        label="Nombre Empleado"
                        variant="outlined"
                        value={persona.nombreCompleto}
                        InputProps={{ readOnly: true }}
                    />
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DateTimePicker
                            value={fechaI}
                            label="Fecha y Hora Visita"
                            minDateTime={new Date()}
                            autoFocus
                            disabled={state}
                            onChange={(newValue) => {
                                setValueFI(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </Box>
                <Box component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '33ch' },
                    }}
                    noValidate
                    autoComplete="off">
                    <TextField
                        select
                        label="Oficinas"
                        onChange={(e) => onValueChange(e)} name="idArea" value={idArea} id="idArea" required InputProps={{ readOnly: state }}>
                        {areas?.map(option => {
                            return (<MenuItem value={option.idArea}> {option.descripcion} </MenuItem>);
                        })}
                    </TextField>
                    <TextField
                        select
                        label="Estado de la Solicitud"
                        onChange={(e) => onValueChange(e)} name="idEstado" value={idEstado} id="idEstado" required InputProps={{ readOnly: action }}>
                        {estados?.map(option => {
                            return (<MenuItem value={option.idEstado}> {option.estado} </MenuItem>);
                        })}
                    </TextField>
                </Box>
                <FormControl>
                    <TextField
                        label="Motivo"
                        variant="outlined"
                        InputProps={{ readOnly: state }}
                        onChange={(e) => onValueChange(e)} name="motivo" value={motivo} id="motivo"
                        inputProps={{ maxLength: 40 }}
                    />
                </FormControl>
                <Table>
                    <TableBody>
                        <TableCell aling="right">
                            ¿Ha sido diagnosticado o ha presentado sospechas de COVID-19?
                        </TableCell>
                        <TableCell><b>{persona.diagnosticado}</b></TableCell>
                        <TableCell aling="right">
                            ¿Tiene familiares que hayan sido diagnosticados por COVID-19?
                        </TableCell>
                        <TableCell><b>{persona.covidFamiliar}</b></TableCell>

                    </TableBody>
                    <TableBody>
                        <TableCell aling="right">
                            ¿Ha presentado síntomas similares a los de la gripe en los últimos 15 días?
                        </TableCell>
                        <TableCell><b>{persona.sintomas}</b></TableCell>
                        <TableCell aling="right">
                            ¿Ha salido del pais durante los ultimos 15 dias?
                        </TableCell>
                        <TableCell><b>{persona.viajo}</b></TableCell>
                    </TableBody>
                </Table>
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => editSolicitudDetails()} disabled={actionButton}>GUARDAR CAMBIOS</Button>
                    <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../solicitudes`}>{name}</Button>
                </FormControl>
            </FormGroup>
        </ThemeProvider>
    );
}

export default EditarSolicitud;