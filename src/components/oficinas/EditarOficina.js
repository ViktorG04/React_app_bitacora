import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { useParams, useHistory } from "react-router-dom";
import { buscarOficina, editOficina } from '../../config/axios';
import { Link } from 'react-router-dom';

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
            alert('Oficina Actualizada');
            history.push('../oficinas');
        } else {
            alert('Error al Actualizar Oficina');
        }
    }

    useEffect(() => { loadOficinaDetails(); }, []);

    const onValueChange = (e) => {
        setOficina({ ...oficina, [e.target.name]: e.target.value })
    };

    return (
        <FormGroup className={classes.container}>
            <Typography variant="h4">Editar Oficina</Typography>
            <FormControl>
                <InputLabel htmlFor="nombre">Nombre</InputLabel>
                <Input type="text"  name='nombre'  onChange={(e) => onValueChange(e)} value={descripcion} inputProps={{maxLength: 20}} required/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">capacidad Personas</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='capacidad' value={capacidad} id="capacidad" type="number" inputProps={{ min: 5, max: 25 }} required/>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel htmlFor="my-input">Estado Oficina</InputLabel>
                <Select onChange={(e) => onValueChange(e)} name="idEstado" value={idEstado} id="idEstado" required>
                    <MenuItem value={1}>Activo</MenuItem>
                    <MenuItem value={2}>Inactivo</MenuItem>
                </Select>
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => editOficinaDetails()}>Guardar Cambios</Button>
                <Button variant="contained" color="secondary" style={{marginTop:10}} component={Link} to={`../oficinas`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}

export default EditarOficina;