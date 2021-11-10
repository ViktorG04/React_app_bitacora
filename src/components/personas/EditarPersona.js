import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useParams, useHistory } from "react-router-dom";
import { buscarPersona, getRoles, getEmpresas, updatePersona, updateEmpleado } from '../../config/axios';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'

const initialValue = {
    idPersona: '',
    idUsuario: '0',
    nombreCompleto: '',
    docIdentidad: '',
    correo: '',
    idRol: '',
    idEstado: '',
    idEmpresa: '',
    password: ''
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
                toast.error('si desea aplicar el cambio de password el SW debe estar activado');
                history.push(`/editarPersona/${id}`);
            }
            persona.password = "";
        } else {
            if (persona['password'] === undefined) {
                toast.error('El campo password esta vacio no se aplicara cambios en la base de datos, si no desea hacer cambios ' +
                    'desactive el SW de cambio password');
                history.push(`/editarPersona/${id}`);
            }
        }

        try {
            await updateEmpleado(persona);
            toast.error('Datos Actualizados');
            history.push('../personas');
        } catch (error) {
            var notificacion = error.request.response.split(":");
            notificacion = notificacion[1].split("}");
            toast.error(notificacion[0]);
        }
    };

    const editDataPerson = async () => {

        delete persona['empresa'];
        delete persona['idEstado'];
        try {
            await updatePersona(persona);
            toast.error('Datos Actualizados');
            history.push('../personas');

        } catch (error) {
            var notificacion = error.request.response.split(":");
            notificacion = notificacion[1].split("}");
            toast.error(notificacion[0]);
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
            <ThemeProvider theme={Theme} >
                <Template />
                <FormGroup className={classes.container}>
                    <div><Toaster /></div>
                    <Typography align="center" variant="h4">Editar Datos Empleado</Typography>
                    <FormControl>
                        <TextField
                            label="Ingrese Nombres y Apellidos"
                            variant="outlined"
                            required
                            type="text" name="nombreCompleto" value={nombreCompleto}
                            onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 60 }}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            label="Ingrese Documento Identidad"
                            variant="outlined"
                            required
                            type="text" name="docIdentidad" value={docIdentidad}
                            onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 20 }}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            label="Ingrese Correo Electronico"
                            variant="outlined"
                            required
                            type="email" name="correo" value={correo}
                            onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 30 }}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            select
                            label="Seleccione un Rol"
                            onChange={(e) => onValueChange(e)} name="idRol" value={idRol} id="idRol" required>
                            {roles?.map(option => {
                                return (<MenuItem value={option.idRol}> {option.rol} </MenuItem>);
                            })}
                        </TextField>
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
                        <FormControlLabel control={
                            <Switch checked={checked} onChange={handleChange} />} label="Cambiar Password" />
                        <TextField
                            variant="outlined"
                            type="password"
                            name="password" value={password} id="password"
                            onChange={(e) => onValueChange(e)}
                            inputProps={{ maxLength: 12 }} disabled={!checked}
                        />
                    </FormControl>
                    <FormControl>
                        <Button variant="contained" color="primary" onClick={() => editDataEmpleado()}>Guardar Cambios</Button>
                        <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../personas`}>Cancelar</Button>
                    </FormControl>
                </FormGroup>
            </ThemeProvider>
        );
    }
    else {
        vista = (
            <ThemeProvider theme={Theme} >
                <Template />
                <FormGroup className={classes.container}>
                    <div><Toaster /></div>
                    <Typography variant="h4">Editar Datos Persona</Typography>
                    <FormControl>
                        <TextField
                            label="Ingrese Nombres y Apellidos"
                            variant="outlined"
                            required
                            type="text" name="nombreCompleto" value={nombreCompleto}
                            onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 60 }}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            label="Ingrese Documento Identidad"
                            variant="outlined"
                            required
                            type="text" name="docIdentidad" value={docIdentidad}
                            onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 20 }}
                        />
                    </FormControl>
                    <FormControl>
                        <TextField
                            select
                            label="Seleccione Empresa"
                            onChange={(e) => onValueChange(e)} name="idEmpresa" value={idEmpresa} id="idEmpresa" required>
                            {empresas?.map(option => {
                                return (<MenuItem value={option.idEmpresa}> {option.nombre} </MenuItem>);
                            })}
                        </TextField>
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
                        <Button variant="contained" color="primary" onClick={() => editDataPerson()}>Guardar Cambios</Button>
                        <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../personas`}>Cancelar</Button>
                    </FormControl>
                </FormGroup>
            </ThemeProvider>
        );

    }

    return vista;
}


export default EditarPersona;