import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import TextField from '@mui/material/TextField';
import { useParams, useHistory } from "react-router-dom";
import { buscarOficina, editOficina } from '../../config/axios';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const initialValue = {
    idArea: '',
    descripcion: '',
    capacidad: '',
    idEstado: ''
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

const EditarOficina = () => {
    const [oficina, setOficina] = useState(initialValue);
    // eslint-disable-next-line no-unused-vars
    const { idArea, descripcion, capacidad, idEstado } = oficina;
    const { id } = useParams();

    const classes = useStyles();

    const history = useHistory();

    const loadOficinaDetails = async () => {
        const response = await buscarOficina(id);
        setOficina(response.data);
    }

    const editOficinaDetails = async () => {
        const result = await editOficina(oficina);
        if (result.data['result'] === 'fields affected') {
            toast.error('Oficina Actualizada');
            history.push('../oficinas');
        } else {
            toast.error('Error al Actualizar Oficina');
        } 
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { loadOficinaDetails(); }, []);

    const onValueChange = (e) => {
        setOficina({ ...oficina, [e.target.name]: e.target.value })
    };

    return (
        <FormGroup className={classes.container}>
            <div><Toaster /></div>
            <Typography align="center" variant="h4">Editar Oficina</Typography>
            <FormControl>
                <TextField
                    label="Nombre Oficina"
                    variant="outlined"
                    required
                    type="text" name="descripcion" value={descripcion}
                    onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 20 }}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label="Capacidad de Personas"
                    variant="outlined"
                    required
                    type="number"
                    name='capacidad' value={capacidad} id="capacidad"
                    onChange={(e) => onValueChange(e)}  inputProps={{ min: 5, max: 25 }} 
                />
            </FormControl>
            <FormControl fullWidth>
                <TextField
                    select
                    label="Seleccione Estado"
                    onChange={(e) => onValueChange(e)} name="idEstado" value={idEstado} id="idEstado" required>
                    <MenuItem value={1}>Activo</MenuItem>
                    <MenuItem value={2}>Inactivo</MenuItem>
                </TextField>
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => editOficinaDetails()}>Guardar Cambios</Button>
                <Button variant="contained" color="secondary" style={{marginTop:10}} component={Link} to={`../oficinas`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}

export default EditarOficina;