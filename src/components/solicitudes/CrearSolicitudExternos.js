import React, { useState, useEffect } from 'react';
import { MenuItem, FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
import { addSolicitud, getEmpresas, getOficinas, getPersonasExternos, getTipos } from '../../config/axios';
import { useHistory } from "react-router-dom";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { Link } from 'react-router-dom';

const initialValue = {
    idUsuario: '1',
    fechayHoraVisita: '',
    motivo: '',
    idArea: '',
    idTipo: '',
    idEmpresa: '',
    empresa: ''
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

const CrearSolicitudExternos = () => {
    const [solicitud, setSolicitud] = useState(initialValue);
    const [areas, setAreas] = useState([]);
    const [fechaI, setValueFI] = useState(new Date());
    const [empresas, setEmpresas] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [personas, setPersonas] = useState([]);
    const [valueEmpresa, setValue] = React.useState(null);
    const [valuePersona, setValuePersona] = React.useState(null);

    //determina si un campo es editable o no
    const [action, setAction] = useState(true);

    const { motivo, idArea, idTipo } = solicitud;
    const classes = useStyles();

    const history = useHistory();

    const filter = createFilterOptions();

    useEffect(() => {
        //consultar todas las areas
        async function getAllOficinas() {
            const response = await getOficinas();
            for (const i in response.data) {
                if (response.data[i]['idEstado'] === 2) {
                    delete response.data[i]
                }
            }
            setAreas(response.data);
        };
        getAllOficinas();

        //obtener todas las empresas
        async function getAllEmpresas() {
            const response = await getEmpresas();

            for (const i in response.data) {
                if (response.data[i]['idEstado'] === 2) {
                    delete response.data[i];
                }
            }
            setEmpresas(response.data);
        };
        getAllEmpresas();

        async function getAllTiposEmpresa() {
            const response = await getTipos();

            delete response.data[0];
            setTipos(response.data);
        };
        getAllTiposEmpresa();



    }, []);

    const onValueChange = (e) => {
        setSolicitud({ ...solicitud, [e.target.name]: e.target.value })
    };

    //obtener todas las personas de la empresa seleccionada
    const getAllPersonas = async (dataEmpresa) => {
        let vacio = [];
        if (dataEmpresa !== null) {
            let id = dataEmpresa.idEmpresa;
            const response = await getPersonasExternos(id);
            setPersonas(response.data);
        } else {
            setPersonas(vacio);
        }
    };


    const addSol = async () => {


        if (idTipo === "") {
            solicitud.idTipo = valueEmpresa.idTipo;
            solicitud.idEmpresa = valueEmpresa.idEmpresa;
            solicitud.empresa = valueEmpresa.nombre;
        } else {
            solicitud.empresa = valueEmpresa.nombre;
            solicitud.idEmpresa = 0;
        }


        console.log(solicitud);

        /*   var time = fechaI.getHours() + ':' + fechaI.getMinutes() + ':00';
           var fechaIngreso = fechaI.toISOString().substr(0, 10);
           solicitud.fechayHoraVisita = fechaIngreso.split("-").reverse().join("-") + ' ' + time;
   
           if (fechaI === Date()) {
               alert("Campo Requerido! Ingrese una fecha valida");
           } else if (motivo.trim() === "") {
               alert("Campo Requerido! Ingrese un motivo")
           } else if (idArea === "") {
               alert("Campo Requerido! Seleccione una Oficina")
           } else if(valueEmpresa === null){
            alert("Campo requerido! Seleccione o escriba el nombre de la entidad")
            }else {
               try {
                   console.log(solicitud);
               //    var result = await addSolicitud(solicitud);
               //    console.log(result.data);
                   //  history.push('../solicitudes');
   
               } catch (error) {
                   var notificacion = error.request.response.split(":");
                   notificacion = notificacion[1].split("}");
                   alert(notificacion[0]);
               }
   
           }*/
    };


    return (
        <FormGroup className={classes.container}>
            <Typography align="center" variant="h4">Agregar solicitud</Typography>
            <FormControl>
                <TextField
                    label="Nombre Completo"
                    variant="outlined"
                    defaultValue="Nombre de la persona logueada"
                    InputProps={{
                        readOnly: true,
                    }}
                />
            </FormControl>
            <FormControl>
                <TextField
                    label="Motivo"
                    variant="outlined"
                    onChange={(e) => onValueChange(e)} name="motivo" value={motivo} id="motivo"
                    inputProps={{ maxLength: 40 }}
                />
            </FormControl>
            <FormControl>
                <TextField
                    select
                    label="Seleccione una Oficina"
                    onChange={(e) => onValueChange(e)} name="idArea" value={idArea} id="idArea" required>
                    {areas?.map(option => {
                        return (<MenuItem value={option.idArea}> {option.descripcion} </MenuItem>);
                    })}
                </TextField>
            </FormControl>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        value={fechaI}
                        label="Fecha y Hora Ingreso"
                        autoFocus
                        minDate={new Date()}
                        onChange={(newValue) => {
                            setValueFI(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
            </FormControl>
            <FormControl>
                <Autocomplete
                    disablePortal
                    value={valueEmpresa}
                    onChange={(event, newValue) => {
                        if (typeof newValue === 'string') {
                            setValue({
                                nombre: newValue,
                            });
                        } else if (newValue && newValue.inputValue) {
                            // Create a new value from the user input
                            setValue({
                                nombre: newValue.inputValue,
                            });
                        } else {
                            setValue(newValue);
                            setAction(true);
                            getAllPersonas(newValue);
                        }
                    }}
                    filterOptions={(options, params) => {
                        const filtered = filter(options, params);

                        const { inputValue } = params;
                        // Suggest the creation of a new value
                        const isExisting = options.some((option) => inputValue === option.nombre);
                        if (inputValue !== '' && !isExisting) {
                            filtered.push({
                                inputValue,
                                nombre: `Add "${inputValue}"`,
                            });
                            setAction(false);
                        }

                        return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="seleccionEmpresa"
                    options={empresas}
                    getOptionLabel={(option) => {
                        // Value selected with enter, right from the input
                        if (typeof option === 'string') {
                            return option;
                        }
                        // Add "xxx" option created dynamically
                        if (option.inputValue) {
                            return option.inputValue;
                        }
                        // Regular option
                        return option.nombre;
                    }}
                    renderOption={(props, option) => <li {...props}>{option.nombre}</li>}

                    freeSolo
                    renderInput={(params) => (
                        <TextField {...params} label="Escriba el nombre de la empresa" />
                    )}
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
            <FormControl>
                <Autocomplete
                    disablePortal
                    options={personas}
                    getOptionLabel={(option) => option.nombreCompleto + " DUI: " + option.docIdentidad}
                    onChange={(newValue) => {
                        setValuePersona(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} label="Seleccione un Empleado" />}
                />
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => addSol()}>Ingresar solicitud</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../solicitudes`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}

export default CrearSolicitudExternos;