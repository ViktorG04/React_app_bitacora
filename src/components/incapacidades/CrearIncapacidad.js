
import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { addIncapacidad, getEmpleados } from '../../config/axios';
import { Link } from 'react-router-dom';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

const initialValue = {
    numIncapacidad: '',
    idEmpleado: '',
    fechaInicio: '',
    fechaFin: '',
    motivo: ''
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

const CrearIncapacidad = () => {
    const [incapacidad, setIncapacidad] = useState(initialValue);
    const { numIncapacidad, motivo } = incapacidad;
    const [empleados, setEmpleados] = useState([]);
    const [empleado, setValue] = useState(empleados[0]);
    const [fechaI, setValueFI] = useState(new Date());
    const [fechaF, setValueFF] = useState(new Date());


    var curr = new Date();
    curr.setDate(curr.getDate() + 30);
    var dateMax = curr.toISOString().substr(0, 10);


    const classes = useStyles();

    const history = useHistory();

    useEffect(() => {
        async function getAllEmpleados() {
            const response = await getEmpleados();
            setEmpleados(response.data);

        };
        getAllEmpleados()

    }, []);

    const onValueChange = (e) => {
        setIncapacidad({ ...incapacidad, [e.target.name]: e.target.value })
    }

    const ingressIncapacidad = async () => {

        var fechaInicio = fechaI.toISOString().substr(0, 10);

        var fechaFin = fechaF.toISOString().substr(0, 10);

        incapacidad.fechaInicio = fechaInicio.split("-").reverse().join("-");
        incapacidad.fechaFin = fechaFin.split("-").reverse().join("-");
       
       if (numIncapacidad.trim() === "") {
               alert("Campo Requerido! Numero Incapacidad");
           } else if (empleado === null) {
               alert("Campo requerido! Empleado")
           } else if (fechaInicio === fechaFin){
            alert("Campo requerido! Fecha Fin es igual a la fecha Inicio")
           } else if (motivo.trim() === "") {
               alert("Campo requerido! motivo de incapacidad")
           } else {
            incapacidad.idEmpleado = empleado.idEmpleado;
               try {
                const result = await addIncapacidad(incapacidad);
                alert(result.data);
                history.push('../incapacidades');
               } catch (error) {
                var notificacion = error.request.response.split(":");
                notificacion = notificacion[1].split("}");
                alert(notificacion[0]);
               }
           }  
    };

    return (
        <FormGroup className={classes.container}>
            <Typography variant="h4">Ingresar Incapacidad</Typography>
            <FormControl>
                <InputLabel htmlFor="numIncapacidad">Numero Incapacidad</InputLabel>
                <Input type="text" name="numIncapacidad" value={numIncapacidad} onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 10 }} required />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="motivo">Motivo Incapacidad</InputLabel>
                <Input type="text" name="motivo" value={motivo} onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 30 }} required />
            </FormControl>
            <FormControl>
                <Autocomplete
                    disablePortal
                    options={empleados}
                    getOptionLabel={(option) => option.nombreCompleto}
                    onChange={(newValue) => {
                        setValue(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Seleccione un Empleado" />}
                />
            </FormControl>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker
                        name="fechaInicio" value={fechaI}
                        label="Fecha Inicio de la Incapacidad"
                        minDate={new Date()}
                        onChange={(newValue) => {
                            setValueFI(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileDatePicker name="fechaFin" value={fechaF}
                        label="Fecha Fin de Incapacidad"
                        minDate={new Date()}
                        maxDate={new Date(dateMax)}
                        onChange={(newValue) => {
                            setValueFF(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl></FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => ingressIncapacidad()}>Ingresar Incapacidad</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`./incapacidades`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}

export default CrearIncapacidad;