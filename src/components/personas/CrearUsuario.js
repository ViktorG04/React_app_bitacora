import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, Typography } from '@material-ui/core';
import Select from '@material-ui/core/Select/Select';
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
            <Typography aling="center" variant="h4">Ingresar Datos Empleado</Typography>
            <FormControl>
                <InputLabel htmlFor="my-input">Nombre Completo</InputLabel>
                <Input type="text" onChange={(e) => onValueChange(e)} name="nombre" value={nombre} id="my-input" inputProps={{ maxLength: 40 }} required/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Documento Identidad</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name="dui" value={dui} id="my-input" inputProps={{ maxLength: 20 }} required/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Correo</InputLabel>
                <Input type="email" onChange={(e) => onValueChange(e)} name="correo" value={correo} id="my-input" inputProps={{ maxLength: 30 }} required/>
            </FormControl>
            <FormControl>
                <Select onChange={(e) => onValueChange(e)} name="idRol" value={idRol} id="my-input" required>
                    {roles?.map(option => {
                        return ( <MenuItem value={option.idRol}> {option.rol} </MenuItem>);
                    })}
                </Select>
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => createNewEmpleado()}>Crear Empleado</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`./personas`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}
export default EditarPersona;