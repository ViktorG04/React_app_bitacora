import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { useParams, useHistory } from "react-router-dom";
import { buscarEmpresa, editEmpresa } from '../../config/axios';
import { Link } from 'react-router-dom';

const initialValue = {
    idEmpresa: '',
    nombre: '',
    idTipo: '',
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

const EditarEmpresa = () => {
    const [empresa, setEmpresa] = useState(initialValue);
    // eslint-disable-next-line no-unused-vars
    const { idEmpresa, nombre, idTipo, idEstado } = empresa;
    const { id } = useParams();

    const classes = useStyles();

    const history = useHistory();

    const loadEmpresaDetails = async () => {
        const response = await buscarEmpresa(id);
        setEmpresa(response.data);
    }

    const editEmpresaDetails = async () => {
        const result = await editEmpresa(empresa);

       if (result.data['msg'] === 'fields affected') {
            alert('Datos Actualizados');
            history.push('../empresas');
        } else {
            alert('Error al Actualizar Datos');
        }
    }

    useEffect(() => { loadEmpresaDetails(); }, []);

    const onValueChange = (e) => {
        setEmpresa({ ...empresa, [e.target.name]: e.target.value })
    };

    return (
        <FormGroup className={classes.container}>
            <Typography variant="h4">Editar Datos Empresa</Typography>
            <FormControl>
                <InputLabel htmlFor="my-input">Nombre</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='nombre' value={nombre} id="my-input"  inputProps={{maxLength: 20}} required/>
            </FormControl>
            <FormControl fullWidth>
                <InputLabel htmlFor="my-input">Tipo Empresa</InputLabel>
                <Select onChange={(e) => onValueChange(e)} name="idTipo" value={idTipo} id="my-input" required>
                    <MenuItem value={1}>Interno</MenuItem>
                    <MenuItem value={2}>Cliente</MenuItem>
                    <MenuItem value={3}>Proveedor</MenuItem>
                    <MenuItem value={4}>Particular</MenuItem>
                </Select>
            </FormControl>

            <FormControl fullWidth>
                <InputLabel htmlFor="my-input">Estado Empresa</InputLabel>
                <Select onChange={(e) => onValueChange(e)} name="idEstado" value={idEstado} id="my-input" required>
                    <MenuItem value={1}>Activo</MenuItem>
                    <MenuItem value={2}>Inactivo</MenuItem>
                </Select>
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => editEmpresaDetails()}>Guardar Cambios</Button>
                <Button variant="contained" color="secondary" style={{marginTop:10}} component={Link} to={`../empresas`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}

export default EditarEmpresa;