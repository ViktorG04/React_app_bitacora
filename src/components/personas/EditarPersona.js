import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { useParams, useHistory } from "react-router-dom";
import { buscarPersona, editEmpresa } from '../../config/axios';

const initialValue = {
    idPersona: '',
    idUsuario: '0',
    nombreCompleto: '',
    docIdentidad: '',
    correo: '',
    idRol: '',
    idEstado: '',
    idEmpresa: ''
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

const EditarPersona = () => {
    const [empresa, setEmpresa] = useState(initialValue);
    const { idPersona, idUsuario, nombreCompleto, docIdentidad, correo, idRol, idEstado } = empresa;
    const { id } = useParams();

    const classes = useStyles();

    const history = useHistory();

    const loadEmpresaDetails = async () => {
        const response = await buscarPersona(id);
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

    let  vista;
    if (!isNaN(idUsuario)) {
       vista = (
            <FormGroup className={classes.container}>
                <Typography variant="h4">Editar Datos Empleado</Typography>
                <FormControl>
                    <InputLabel htmlFor="my-input">Nombre Completo</InputLabel>
                    <Input onChange={(e) => onValueChange(e)} name='nombre' value={nombreCompleto} id="my-input" maxlength="60"/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="my-input">Documento Identidad</InputLabel>
                    <Input onChange={(e) => onValueChange(e)} name='nombre' value={docIdentidad} id="my-input" maxlength="20"/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="my-input">Correo</InputLabel>
                    <Input onChange={(e) => onValueChange(e)} name='nombre' value={correo} id="my-input" maxlength="30"/>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel htmlFor="my-input">Rol</InputLabel>
                    <Select onChange={(e) => onValueChange(e)} name="idTipo" value={idRol} id="my-input">
                        <MenuItem value={1}>RRHH</MenuItem>
                        <MenuItem value={2}>Empleado</MenuItem>
                        <MenuItem value={3}>Seguridad</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel htmlFor="my-input">Estado</InputLabel>
                    <Select onChange={(e) => onValueChange(e)} name="idEstado" value={idEstado} id="my-input" label="Disabled">
                        <MenuItem value={1}>Activo</MenuItem>
                        <MenuItem value={2}>Inactivo</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => editEmpresaDetails()}>Guardar Cambios</Button>
                </FormControl>
            </FormGroup>
        );
    }
    else {
        vista = (
            <FormGroup className={classes.container}>
                <Typography variant="h4">Editar Datos Persona</Typography>
                <FormControl>
                    <InputLabel htmlFor="my-input">Nombre Completo</InputLabel>
                    <Input onChange={(e) => onValueChange(e)} name='nombre' value={nombreCompleto} id="my-input" maxlength="60"/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="my-input">Documento Identidad</InputLabel>
                    <Input onChange={(e) => onValueChange(e)} name='docIdentidad' value={docIdentidad} id="my-input" maxlength="20"/>
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="my-input">Empresa</InputLabel>
                    <Input onChange={(e) => onValueChange(e)} name='empresa' value={empresa} id="my-input" maxlength="30"/>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel htmlFor="my-input">Estado</InputLabel>
                    <Select onChange={(e) => onValueChange(e)} name="idEstado" value={idEstado} id="my-input" label="Disabled">
                        <MenuItem value={1}>Activo</MenuItem>
                        <MenuItem value={2}>Inactivo</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => editEmpresaDetails()}>Guardar Cambios</Button>
                </FormControl>
            </FormGroup>
        );

    }

    return vista;
}


export default EditarPersona;