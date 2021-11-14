import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { useHistory } from "react-router-dom";
import { addEmpleado, getRoles } from '../../config/axios';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'

const initialValue = {
    nombre: '',
    dui: '',
    correo: '',
    idRol: ''
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
    const [empleado, setEmpleado] = useState(initialValue);
    const { nombre, dui, correo, idRol } = empleado;

    const [roles, setRoles] = useState([]);

    const classes = useStyles();

    const history = useHistory();

    const onValueChange = (e) => {
        setEmpleado({ ...empleado, [e.target.name]: e.target.value });
    }

    useEffect(() => {
        async function getAllRoles() {
            const response = await getRoles();
            setRoles(response.data);
        };
        getAllRoles()

    }, []);


    const createNewEmpleado = async () => {
        if (nombre.trim() === "") {
            toast.error("Campo Requerido! Nombres");
        } else if (dui.trim() === "") {
            toast.error("Campo requerido! Documento Identidad")
        } else if (correo.trim() === "") {
            toast.error("Campo requerido! Correo empleado")
        } else if (correo.trim() === "") {
            toast.error("Campo requerido! Correo empleado")
        }
        else {
            try {
                const result = await addEmpleado(empleado);
                if (result['data'] === 'fields affected') {
                    toast.success('Empleado Registrado, su usuario y password han sido enviados al correo electronico registrado');
                    setTimeout(() => {
                        history.push('../personas');
                     }, 2000);
                }
            } catch (error) {
                if (error.request.response !== '') {
                var notificacion = error.request.response.split(":");
                notificacion = notificacion[1].split("}");
                toast.error(notificacion[0]);
                }else {
                    toast.error("ERROR NETWORK, no se obtuvo respuesta con el servidor");
                }
            }
        }
    };

    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <FormGroup className={classes.container}>
                <div><Toaster /></div>
                <Typography align="center" variant="h4">Ingresar Datos Empleado</Typography>
                <FormControl>
                    <TextField
                        label="Ingrese Nombres y Apellidos"
                        variant="outlined"
                        required
                        type="text" name="nombre" value={nombre}
                        onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 40 }}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Ingrese Documento Identidad"
                        variant="outlined"
                        required
                        type="text" name="dui" value={dui}
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
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => createNewEmpleado()}>Crear Empleado</Button>
                    <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`./personas`}>Cancelar</Button>
                </FormControl>
            </FormGroup>
        </ThemeProvider>
    );
}
export default EditarPersona;