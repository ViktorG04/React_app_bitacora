import React, { useState } from 'react';
import { Select, MenuItem, FormGroup, FormControl, InputLabel, Input, Button, makeStyles, Typography } from '@material-ui/core';
import { addSolicitud } from '../config/axios';
import { useHistory } from "react-router-dom";

const initialValue = {
    idUsuario: '1',
    fechayHoraVisita: '',
    motivo: '',
    idArea: '',
    sintomas: '',
    diagnosticado: '',
    covidFamiliar: '',
    viajo: ''
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
    const { idUsuario, fechayHoraVisita, motivo, idArea, sintomas, diagnosticado, covidFamiliar, viajo } = solicitud;
    const classes = useStyles();

    const history = useHistory();
    
    const onValueChange = (e) => {
        setSolicitud({...solicitud, [e.target.name]: e.target.value})
    }

    const addSol = async() => {
        if (fechayHoraVisita.trim() === ""){
            alert("Ingrese una fecha valida");   
        } else if(motivo.trim() === ""){
            alert("Motivo requerido")
        } else if(idArea.trim() === ""){
            alert("Area requerida")
        } else {
            console.log(solicitud);
            /*await addSolicitud(solicitud);
            alert('Solicitud agregada');
            history.push('./adminhome');*/
        }
    }


    return (
        <FormGroup className={classes.container}>
            <Typography variant="h4">Agregar solicitud</Typography>
            <FormControl>
                <InputLabel htmlFor="my-input">IdUsuario</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='IdUsuario' value={idUsuario} id="my-input" />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Fecha y Hora visita</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='fechayHoraVisita' value={fechayHoraVisita} id="my-input" />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Motivo</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='motivo' value={motivo} id="my-input"/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">idArea</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='idArea' value={idArea} id="my-input" />
            </FormControl>
            <FormControl>
            <Select
                labelId="demo-simple-select-label"
                name='sintomas'
                value={sintomas}
                label="Age"
                onChange={(e) => onValueChange(e)}
                >
                <MenuItem value={sintomas}>Si</MenuItem>
                <MenuItem value={sintomas}>No</MenuItem>
            </Select>
            </FormControl>
            <FormControl>
            <InputLabel htmlFor="my-input">Ha sido diagnosticado o ha presentado sospechas de COVID-19?</InputLabel>
                <select onChange={(e) => onValueChange(e)} name="diagnosticado" id="diagnosticado">
                    <option value={diagnosticado}>Si</option>
                    <option value={diagnosticado}>No</option>
                </select>
            </FormControl>
            <FormControl>
            <InputLabel htmlFor="my-input">Tiene familiares que hayan sido diagnosticados por COVID-19?</InputLabel>
                <select onChange={(e) => onValueChange(e)} name="covidFamiliar" id="covidFamiliar">
                    <option value={covidFamiliar}>Si</option>
                    <option value={covidFamiliar}>No</option>
                </select>
            </FormControl>
            <FormControl>
            <InputLabel htmlFor="my-input">Ha salido del pais durante los pasados 15 dias?</InputLabel>
                <select onChange={(e) => onValueChange(e)} name="viajo" id="viajo">
                    <option value={viajo}>Si</option>
                    <option value={viajo}>No</option>
                </select>
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => addSol()}>Agregar usuario</Button>
            </FormControl>
        </FormGroup>
    );
}
 
export default CrearSolicitud;