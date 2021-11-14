import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import TextField from '@mui/material/TextField';
import { useParams, useHistory } from "react-router-dom";
import { buscarEmpresa, editEmpresa, getTipos } from '../../config/axios';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'

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
    const [action, setAction] = useState(false);
    const [tipos, setTipos] = useState([]);

    const classes = useStyles();

    const history = useHistory();

    const loadEmpresaDetails = async () => {
        const response = await buscarEmpresa(id);
        setEmpresa(response.data);

        if (response.data['idEmpresa'] === 1) {
            setAction(true);
        }
    }

    const editEmpresaDetails = async () => {
        const result = await editEmpresa(empresa);

        if (result.data['msg'] === 'fields affected') {
            toast.success('Datos Actualizados');
            setTimeout(() => {
                history.push('../empresas');
             }, 2000);
        } else {
           toast.error('Error al Actualizar Datos');
        }
    }

    useEffect(() => {
        loadEmpresaDetails();

        async function getAllTiposEmpresa() {
            const response = await getTipos();
            
            setTipos(response.data);
        };
        getAllTiposEmpresa();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onValueChange = (e) => {
        setEmpresa({ ...empresa, [e.target.name]: e.target.value })
    };

    return (
        <ThemeProvider theme={Theme} >
        <Template />
        <FormGroup className={classes.container}>
            <div><Toaster /></div>
            <Typography align="center" variant="h4">Editar Datos Empresa</Typography>
            <FormControl>
                <TextField
                    label="Nombre Empresa"
                    variant="outlined"
                    required
                    type="text" name="nombre" value={nombre}
                    onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 60 }}
                />
            </FormControl>
            <FormControl>
                <TextField
                    select
                    label="Tipo de Empresa"
                    onChange={(e) => onValueChange(e)} name="idTipo" value={idTipo} id="idTipo" required>
                    {tipos?.map(option => {
                        return (<MenuItem value={option.idTipo}> {option.tipo} </MenuItem>);
                    })}
                </TextField>
            </FormControl>
            <FormControl>
                <TextField
                    select
                    label="Seleccione Estado"
                    disabled={action}
                    onChange={(e) => onValueChange(e)} name="idEstado" value={idEstado} id="idEstado" required>
                    <MenuItem value={1}>Activo</MenuItem>
                    <MenuItem value={2}>Inactivo</MenuItem>
                </TextField>
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => editEmpresaDetails()}>Guardar Cambios</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../empresas`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
        </ThemeProvider>
    );
}

export default EditarEmpresa;