import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select/Select';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useParams, useHistory } from "react-router-dom";
import { buscarPersona, getRoles, getEmpresas, updatePersona, updateEmpleado } from '../../config/axios';
import { Link } from 'react-router-dom';

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
    const [persona, setPersona] = useState(initialValue);
    // eslint-disable-next-line no-unused-vars
    const { idPersona, idUsuario, nombreCompleto, docIdentidad, correo, idRol, idEmpresa, idEstado, password } = persona;
    const { id } = useParams();

    const [roles, setRoles] = useState([]);

    const [empresas, setEmpresas] = useState([]);

    const [checked, setChecked] = useState(false);

    const classes = useStyles();

    const history = useHistory();

    const editDataEmpleado = async () => {

        delete persona['idPersona'];
        delete persona['idEmpresa'];
        delete persona['idEstado'];
        delete persona['usuario'];

        if (checked !== true) {
            if (persona['password']) {
                alert('si desea aplicar el cambio de password el SW debe estar activado');
                history.push(`/editarPersona/${id}`);
            }
            persona.password = "";
        } else {
            if (persona['password'] === undefined) {
                alert('El campo password esta vacio no se aplicara cambios en la base de datos, si no desea hacer cambios ' +
                    'desactive el SW de cambio password');
                history.push(`/editarPersona/${id}`);
            }
        }

        try {
            await updateEmpleado(persona);
            alert('Datos Actualizados');
            history.push('../personas');
        } catch (error) {
            var notificacion = error.request.response.split(":");
            notificacion = notificacion[1].split("}");
            alert(notificacion[0]);
        }
    };

    const editDataPerson = async () => {

        delete persona['empresa'];
        delete persona['idEstado'];
        try {
            await updatePersona(persona);
            alert('Datos Actualizados');
            history.push('../personas');

        } catch (error) {
            var notificacion = error.request.response.split(":");
            notificacion = notificacion[1].split("}");
            alert(notificacion[0]);
        }

    };

    useEffect(() => {
        async function getAllRoles() {
            const response = await getRoles();
            setRoles(response.data);
        };
        getAllRoles()

        async function getAllEmpresas() {
            const response = await getEmpresas()
            setEmpresas(response.data);
        };
        getAllEmpresas()

        async function loadDataPersona() {
            const response = await buscarPersona(id);
            setPersona(response.data);
        }
        loadDataPersona();

    }, [id]);

    const onValueChange = (e) => {
        setPersona({ ...persona, [e.target.name]: e.target.value })
    };

    const handleChange = (e) => {
        setChecked(e.target.checked);
    };

    let vista;
    if (!isNaN(idUsuario)) {
        vista = (
            <FormGroup className={classes.container}>

                <Typography variant="h4">Editar Datos Empleado</Typography>
                <FormControl>
                    <InputLabel htmlFor="my-input">Nombre Completo</InputLabel>
                    <Input onChange={(e) => onValueChange(e)} name="nombreCompleto" value={nombreCompleto} id="nombreCompleto" maxlength="60" />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="my-input">Documento Identidad</InputLabel>
                    <Input onChange={(e) => onValueChange(e)} name="docIdentidad" value={docIdentidad} id="docIdentidad" maxlength="20" />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="my-input">Correo</InputLabel>
                    <Input onChange={(e) => onValueChange(e)} name="correo" value={correo} id="correo" maxlength="30" />
                </FormControl>
                <FormControl>
                    <Select onChange={(e) => onValueChange(e)} name="idRol" value={idRol} id="idRol" required>
                        {roles?.map(option => {
                            return (<MenuItem value={option.idRol}> {option.rol} </MenuItem>);
                        })}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel htmlFor="my-input">Estado</InputLabel>
                    <Select onChange={(e) => onValueChange(e)} name="idEstado" value={idEstado} id="idEstado" disabled>
                        <MenuItem value={1}>Activo</MenuItem>
                        <MenuItem value={2}>Inactivo</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <FormControlLabel control={
                        <Switch checked={checked} onChange={handleChange} />} label="Cambiar Password" />
                    <Input type="password" onChange={(e) => onValueChange(e)} name="password" value={password} id="password" inputProps={{ maxLength: 12 }} disabled={!checked} />
                </FormControl>
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => editDataEmpleado()}>Guardar Cambios</Button>
                    <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../personas`}>Cancelar</Button>
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
                    <Input onChange={(e) => onValueChange(e)} name="nombreCompleto" value={nombreCompleto} id="my-input" inputProps={{ maxLength: 40 }} required />
                </FormControl>
                <FormControl>
                    <InputLabel htmlFor="my-input">Documento de Identidad</InputLabel>
                    <Input onChange={(e) => onValueChange(e)} name='docIdentidad' value={docIdentidad} id="my-input" inputProps={{ maxLength: 20 }} required />
                </FormControl>
                <FormControl>
                    <Select onChange={(e) => onValueChange(e)} name="idEmpresa" value={idEmpresa} id="my-input" required>
                        {empresas?.map(option => {
                            return (<MenuItem value={option.idEmpresa}> {option.nombre} </MenuItem>);
                        })}
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel htmlFor="my-input">Estado</InputLabel>
                    <Select onChange={(e) => onValueChange(e)} name="idEstado" value={idEstado} id="my-input" disabled>
                        <MenuItem value={1}>Activo</MenuItem>
                        <MenuItem value={2}>Inactivo</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => editDataPerson()}>Guardar Cambios</Button>
                    <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../personas`}>Cancelar</Button>
                </FormControl>
            </FormGroup>
        );

    }

    return vista;
}


export default EditarPersona;