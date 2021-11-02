import React, { useState, useEffect } from 'react';
import { MenuItem, FormGroup, FormControl, Button, makeStyles, Typography, NativeSelect } from '@material-ui/core';
import { addSolicitud, getOficinas } from '../../config/axios';
import { useHistory } from "react-router-dom";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { Link } from 'react-router-dom';

const initialValue = {
    idUsuario: '14',
    fechayHoraVisita: '',
    motivo: '',
    idArea: '',
    sintomas: 'No',
    diagnosticado: 'No',
    covidFamiliar: 'No',
    viajo: 'No'
}

const useStyles = makeStyles({
    container: {
        width: '50%',
        margin: '5% 0 0 25%',
        '& > *': {
            marginTop: 20
        }
    }
})

const CrearSolicitud = () => {
    const [solicitud, setSolicitud] = useState(initialValue);
    const [areas, setAreas] = useState([]);
    const [fechaI, setValueFI] = useState(new Date());
    const { motivo, idArea } = solicitud;
    const classes = useStyles();

    const history = useHistory();


    useEffect(() => {
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

    }, []);

    const onValueChange = (e) => {
        setSolicitud({ ...solicitud, [e.target.name]: e.target.value })
    }


    const addSol = async () => {

        var time = fechaI.getHours() + ':' + fechaI.getMinutes() + ':00';
        var fechaIngreso = fechaI.toISOString().substr(0, 10);
        solicitud.fechayHoraVisita = fechaIngreso.split("-").reverse().join("-") + ' ' + time;

        if (fechaI === Date()) {
            alert("Campo Requerido! Ingrese una fecha valida");
        } else if (motivo.trim() === "") {
            alert("Campo Requerido! Ingrese un motivo")
        } else if (idArea === "") {
            alert("Campo Requerido! Seleccione una Oficina")
        } else if (solicitud['sintomas'] !== 'No') {
            alert("SU SOLICITUD NO PUEDE SER CREADA YA QUE HA SELECCIONADO 'SI TENER SINTOMAS QUE SE ASEMEJEN" +
                "A COVID-19', FAVOR PONERSE EN CONTACTO CON RECURSOS HUMANOS");
        }else if (solicitud['diagnosticado'] !== 'No') {
            alert("SU SOLICITUD NO PUEDE SER CREADA YA QUE HA SELECCIONADO 'SI HABER SIDO DIGNOSTICADO POR" +
                "COVID-19', FAVOR PONERSE EN CONTACTO CON RECURSOS HUMANOS");
        }else if (solicitud['covidFamiliar'] === 'Si' & solicitud['viajo'] === 'Si') {
            // history.push(`/editarPersona/${id}`);
            alert("SU SOLICITUD NO PUEDE SER CREADA YA QUE HA SELECCIONADO TENER UN FAMILIAR O HABER SALIDO DEL PAIS LOS ULTIMOS 15 DIAS" +
                " FAVOR DE PONERSE EN CONTACTO CON RECURSOS HUMANOS")
        } else {
            try {
                console.log(solicitud);
                var result = await addSolicitud(solicitud);
                console.log(result.data);
                history.push('../solicitudes');

            } catch (error) {
                var notificacion = error.request.response.split(":");
                notificacion = notificacion[1].split("}");
                alert(notificacion[0]);
            }

        }
    }


    return (
        <FormGroup className={classes.container}>
            <Typography variant="h4">Agregar solicitud</Typography>
            <FormControl>
                <TextField
                    label="Nombre Completo"
                    variant="outlined"
                    disabled
                    defaultValue="Nombre de la persona logueada"
                />
            </FormControl>
            <FormControl>
                <TextField
                    label="Motivo"
                    variant="outlined"
                    onChange={(e) => onValueChange(e)} name="motivo" value={motivo} id="motivo"
                    inputProps={{ maxLength: 40 }}
                />
            </FormControl>
            <FormControl>
                <TextField
                    select
                    label="Seleccione una Oficina"
                    onChange={(e) => onValueChange(e)} name="idArea" value={idArea} id="idArea" required>
                    {areas?.map(option => {
                        return (<MenuItem value={option.idArea}> {option.descripcion} </MenuItem>);
                    })}
                </TextField>
            </FormControl>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        value={fechaI}
                        label="Fecha y Hora Ingreso"
                        autoFocus
                        minDate={new Date()}
                        onChange={(newValue) => {
                            setValueFI(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl>
                <label htmlFor="my-input">¿Ha presentado síntomas de tos, fiebre moderada a alta, dolor de garganta,
                    secreción nasal, dificultad para respirar o síntomas similares a los de la gripe en los últimos 15 días?</label>
                <NativeSelect
                    defaultValue={"No"}
                    inputProps={{
                        name: 'sintomas',
                        id: 'uncontrolled-native',
                    }}
                    onChange={(e) => onValueChange(e)}>
                    <option value={"Si"}>Si</option>
                    <option value={"No"}>No</option>
                </NativeSelect>
            </FormControl>
            <FormControl>
                <label htmlFor="my-input">Ha sido diagnosticado o ha presentado sospechas de COVID-19?</label>
                <NativeSelect
                    defaultValue={"No"}
                    inputProps={{
                        name: 'diagnosticado',
                        id: 'uncontrolled-native',
                    }}
                    onChange={(e) => onValueChange(e)}>
                    <option value={"Si"}>Si</option>
                    <option value={"No"}>No</option>
                </NativeSelect>
            </FormControl>
            <FormControl>
                <label htmlFor="my-input">Tiene familiares que hayan sido diagnosticados por COVID-19?</label>
                <NativeSelect
                    defaultValue={"No"}
                    inputProps={{
                        name: 'covidFamiliar',
                        id: 'uncontrolled-native',
                    }}
                    onChange={(e) => onValueChange(e)}>
                    <option value={"Si"}>Si</option>
                    <option value={"No"}>No</option>
                </NativeSelect>
            </FormControl>
            <FormControl>
                <label htmlFor="my-input">Ha salido del pais durante los ultimos 15 dias?</label>
                <NativeSelect
                    defaultValue={"No"}
                    inputProps={{
                        name: 'viajo',
                        id: 'uncontrolled-native',
                    }}
                    onChange={(e) => onValueChange(e)}>
                    <option value={"Si"}>Si</option>
                    <option value={"No"}>No</option>
                </NativeSelect>
            </FormControl>

            <FormControl>
                <Button variant="contained" color="primary" onClick={() => addSol()}>Ingresar solicitud</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../solicitudes`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}

export default CrearSolicitud;