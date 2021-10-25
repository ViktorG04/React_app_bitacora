/* eslint-disable no-const-assign */
import React, { useState } from 'react';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { addOficina } from '../../config/axios';
import { Link } from 'react-router-dom';

const initialValue = {
    nombre: '',
    estado: '',
    capacidad: ''
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

const CrearOficina = () => {
    const [oficina, setOficina] = useState(initialValue);
    const { nombre, capacidad } = oficina;

    const classes = useStyles();

    const history = useHistory();

    const onValueChange = (e) => {
        setOficina({ ...oficina, [e.target.name]: e.target.value })
    }

    const addOfi = async () => {
        if (nombre.trim() === "") {
            alert("Campo Requerido Nombre");
        } else if (capacidad.trim() === "") {
            alert("Campo requerido Capacidad")
        } else {
            oficina.estado = '1';
           const result = await addOficina(oficina);

            if (result.data['result'] === 'fields affected') {
                alert('Oficina Creada');
                history.push('./oficinas');
            }else{
                alert('Error al Crear Oficina');
            }
        }
    };

    return (
        <FormGroup className={classes.container}>
         <Typography variant="h4">Agregar oficina</Typography>
            <FormControl>
                <InputLabel htmlFor="nombre">Nombre Oficina</InputLabel>
                <Input type="text"  name="nombre"  onChange={(e) => onValueChange(e)} inputProps={{maxLength: 20}} required/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="capacidad">capacidad</InputLabel>
                <Input type="number"  label="Number"  name="capacidad" defaultValue="5" onChange={(e) => onValueChange(e)} inputProps={{ min: 5, max: 25 }} required/>
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => addOfi()}>Agregar Oficina</Button> 
                <Button variant="contained" color="secondary" style={{marginTop:10}} component={Link} to={`./oficinas`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}

export default CrearOficina;