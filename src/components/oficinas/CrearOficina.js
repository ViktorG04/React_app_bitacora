import React, { useState } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import { useHistory } from "react-router-dom";
import { addOficina } from '../../config/axios';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'

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
            toast.error("Campo Requerido! Nombre de la oficina");
        } else if (capacidad.trim() === "") {
            toast.error("Campo requerido! Capacidad")
        } else {
            oficina.estado = '1';
            const result = await addOficina(oficina);

            if (result.data['result'] === 'fields affected') {
                toast.success('Oficina Creada');
                setTimeout(() => {
                    history.push('../oficinas');
                 }, 2000);
            } else {
                toast.error('Error al Crear Oficina');
            }
        }
    };

    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <FormGroup className={classes.container}>
                <div><Toaster /></div>
                <Typography align="center" variant="h4">Agregar Oficina</Typography>
                <FormControl>
                    <TextField
                        label="Nombre Oficina"
                        variant="outlined"
                        required
                        type="text" name="nombre" value={nombre}
                        onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 20 }}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Capacidad de Personas"
                        variant="outlined"
                        required
                        type="number"
                        defaultValue="5"
                        name='capacidad' id="capacidad" value={capacidad}
                        onChange={(e) => onValueChange(e)} inputProps={{ min: 5, max: 25 }}
                    />
                </FormControl>
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => addOfi()}>Agregar Oficina</Button>
                    <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`./oficinas`}>Cancelar</Button>
                </FormControl>
            </FormGroup>
        </ThemeProvider>
    );
}

export default CrearOficina;