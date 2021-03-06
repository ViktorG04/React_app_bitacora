
import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
import { useHistory } from "react-router-dom";
import { addIncapacidad, getEmpleados } from '../../config/axios';
import { Link } from 'react-router-dom';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import toast, { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'

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
        margin: '5% 0 0 18%',
        '& > *': {
            marginTop: 20
        }
    }
})

const CrearIncapacidad = () => {
    const [incapacidad, setIncapacidad] = useState(initialValue);
    const { numIncapacidad, motivo } = incapacidad;

    //manejar autocomple
    const [empleados, setEmpleados] = useState([]);
    const [empleado, setValue] = useState(0);

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
        getAllEmpleados();
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
            toast.error("Campo Requerido! Numero Incapacidad");
        } else if (empleado === null) {
            toast.error("Campo requerido! Empleado")
        } else if (fechaInicio === fechaFin) {
            toast.error("Campo requerido! Fecha Fin es igual a la fecha Inicio")
        } else if (motivo.trim() === "") {
            toast.error("Campo requerido! motivo de incapacidad")
        } else {
            incapacidad.idEmpleado = empleado.idEmpleado;
            try {
                const result = await addIncapacidad(incapacidad);
                toast.success(result.data);
                setTimeout(() => {
                    history.push('../incapacidades');
                }, 2000);
            } catch (error) {
                if (error.request.response !== '') {
                    var notificacion = error.request.response.split(":");
                    notificacion = notificacion[1].split("}");
                    toast.error(notificacion[0]);
                    setIncapacidad(initialValue);
                } else {
                    toast.error("ERROR NETWORK, no se obtuvo respuesta con la parte del servidor");
                }
            }
        }
    };

    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <FormGroup className={classes.container}>
                <div><Toaster /></div>
                <Typography align="center" variant="h4">Ingresar Incapacidad</Typography>
                <FormControl>
                    <TextField
                        label="Ingrese Numero Incapacidad"
                        variant="outlined"
                        required
                        type="text" name="numIncapacidad" value={numIncapacidad}
                        onChange={(e) => onValueChange(e)} inputProps={{ maxLength: 10 }}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Motivo de Incapacidad"
                        variant="outlined"
                        required
                        type="text"
                        onChange={(e) => onValueChange(e)} name="motivo" value={motivo} id="motivo"
                        inputProps={{ maxLength: 30 }}
                    />
                </FormControl>
                <FormControl>
                    <Autocomplete
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        options={empleados}
                        getOptionLabel={(option) => option.nombreCompleto}
                        renderInput={(params) => <TextField {...params} label="Buscar Empleado" />}
                    />
                </FormControl>
                <FormControl>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                            name="fechaInicio" value={fechaI}
                            inputFormat="dd-MM-yyyy"
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
                            inputFormat="dd-MM-yyyy"
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
        </ThemeProvider>
    );
}

export default CrearIncapacidad;