import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import MenuItem from '@material-ui/core/MenuItem/MenuItem';
import { useHistory } from "react-router-dom";
import { addEmpleado, getRoles } from '../../config/axios';
import { Link } from 'react-router-dom';

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
            alert("Campo Requerido! Nombres");
        } else if (dui.trim() === "") {
            alert("Campo requerido! Documento Identidad")
        } else if (correo.trim() === "") {
            alert("Campo requerido! Correo empleado")
        } else if (correo.trim() === "") {
            alert("Campo requerido! Correo empleado")
        }
        else {
            try {
                const result = await addEmpleado(empleado);
                if (result['data'] === 'fields affected') {
                    alert('Empleado Registrado, su usuario y password han sido enviados al correo electronico registrado');
                    history.push('./personas');
                }
            } catch (error) {
                var notificacion = error.request.response.split(":");
                notificacion = notificacion[1].split("}");
                alert(notificacion[0]);
            }
        }
    };

    return (
        <FormGroup className={classes.container}>
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
    );
}
export default EditarPersona;