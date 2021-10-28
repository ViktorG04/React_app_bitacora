
/* eslint-disable no-const-assign */
import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import DesktopDatePicker from '@mui/core';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import { useHistory } from "react-router-dom";
import { addIncapacidad, getEmpleados } from '../../config/axios';
import { Link } from 'react-router-dom';

const initialValue = {
    numIncapacidad: '',
    idEmpleado: '',
    fechaInicio: '',
    fechaFin: '',
    motivo: ''
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

const CrearIncapacidad = () => {
    const [incapacidad, setIncapacidad] = useState(initialValue);
    const { numIncapacidad, idEmpleado, fechaInicio, fechaFin, motivo } = incapacidad;

    const [empleados, setEmpleados] = useState([]);

    const classes = useStyles();

    const history = useHistory();

    useEffect(() => {
        async function getAllRoles() {
            const response = await getEmpleados();
            setEmpleados(response.data);
        };
        getAllRoles()

    }, []);

    const onValueChange = (e) => {
        setIncapacidad({ ...incapacidad, [e.target.name]: e.target.value })
    }


    const addOfi = async () => {
        if (numIncapacidad.trim() === "") {
            alert("Campo Requerido! Numero Incapacidad");
        } else if (idEmpleado.trim() === "") {
            alert("Campo requerido! Empleado")
        } else if (fechaInicio.trim() === "") {
            alert("Campo requerido! Fecha Inicio")
        } else if (fechaFin.trim() === "") {
            alert("Campo requerido! Fecha Fin")
        } else if (motivo.trim() === "") {
            alert("Campo requerido! motivo de incapacidad")
        } else {
            console.log(incapacidad);
            const result = await addIncapacidad(incapacidad);

            if (result.data['result'] === 'fields affected') {
                alert('Oficina Creada');
                history.push('./incapacidades');
            } else {
                alert('Error al Crear Oficina');
            }
        }
    };

    return (
        <FormGroup className={classes.container}>
            <Typography variant="h4">Ingresar Incapacidad</Typography>
            <FormControl>
                <InputLabel htmlFor="numIncapacidad">Numero Incapacidad</InputLabel>
                <Input type="text" name="numIncapacidad" value={numIncapacidad} onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 10 }} required />
            </FormControl>
            <FormControl>
                <Select onChange={(e) => onValueChange(e)} name="idEmpleado" value={idEmpleado} id="my-input" required>
                    {empleados?.map(option => {
                        return (<MenuItem value={option.idEmpleado}> {option.nombreCompleto} </MenuItem>);
                    })}
                </Select>
            </FormControl>
            <FormControl>
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => addOfi()}>Agregar Oficina</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`./incapacidades`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}

export default CrearIncapacidad;