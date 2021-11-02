import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import TextField from '@mui/material/TextField';
import { useParams, useHistory } from "react-router-dom";
import { buscarEmpresa, editEmpresa, getTipos } from '../../config/axios';
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
            alert('Datos Actualizados');
            history.push('../empresas');
        } else {
            alert('Error al Actualizar Datos');
        }
    }

    useEffect(() => {
        loadEmpresaDetails();

        async function getAllTiposEmpresa() {
            const response = await getTipos();
            if (action === false) {
                delete response.data[0];
            }
            setTipos(response.data);
        };
        getAllTiposEmpresa();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onValueChange = (e) => {
        setEmpresa({ ...empresa, [e.target.name]: e.target.value })
    };

    return (
        <FormGroup className={classes.container}>
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
            <FormControl fullWidth>
                <TextField
                    select
                    label="Seleccione Tipo de Empresa"
                    disabled={action}
                    onChange={(e) => onValueChange(e)} name="idTipo" value={idTipo} id="idTipo" required>
                    {tipos?.map(option => {
                        return (<MenuItem value={option.idTipo}> {option.tipo} </MenuItem>);
                    })}
                </TextField>
            </FormControl>
            <FormControl fullWidth>
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
    );
}

export default EditarEmpresa;