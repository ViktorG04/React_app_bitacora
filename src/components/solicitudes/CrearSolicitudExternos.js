import { useState, useEffect, useContext } from 'react';
import { MenuItem, FormGroup, FormControl, Button, makeStyles, Typography, IconButton } from '@material-ui/core';
import { addSolicitudVisitas, getEmpresas, getOficinas, getPersonasExternos, getTipos } from '../../config/axios';
import { useHistory } from "react-router-dom";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';
import toast, { Toaster } from 'react-hot-toast';
import UserLoginContext from '../../context/login/UserLoginContext';
import decrypt from '../../utils/decrypt';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'
import { Stack } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';

const initialValue = {
    idUsuario: '',
    fechayHoraVisita: '',
    motivo: '',
    idArea: '',
    idTipoEmpresa: '',
    idEmpresa: '',
    empresa: '',
    personas: []
}

const initialPerson = {
    idPersona: '',
    nombre: '',
    dui: ''
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

const CrearSolicitudExternos = () => {
    const [solicitud, setSolicitud] = useState(initialValue);
    const [areas, setAreas] = useState([]);
    const [fechaI, setValueFI] = useState(new Date());
    const [empresas, setEmpresas] = useState([]);
    const [tipos, setTipos] = useState([]);
    const [personas, setPersonas] = useState([]);

    const [valueEmpresa, setValue] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [valuePersona, setValuePersona] = useState(null);

    const [inputFields, setInputFields] = useState([initialPerson]);

    //determina si un campo es editable o no
    const [action, setAction] = useState(true);

    //editable agregar persona
    const [stateBtnAdd, setStateBtnAdd] = useState(false);

    //editable eliminar persona
    const [stateBtnDelete, setStateBtnDelete] = useState(true);

    //ingresar numero de dui si esta persona es nueva
    const [stateInputDui, setStateInputDui] = useState(true);

    const { motivo, idArea, idTipoEmpresa } = solicitud;


    const classes = useStyles();
    const history = useHistory();

    const userStateEncrypt = useContext(UserLoginContext);
    const userStore = JSON.parse(decrypt(userStateEncrypt.userLogin));

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

    const viewTipoE = (nuevaE) => {
        var vista;
        if (nuevaE === false) {
            vista = (
                <FormControl fullWidth>
                    <TextField
                        select
                        label="Seleccione Tipo de Empresa"
                        onChange={(e) => onValueChange(e)} name="idTipo" value={idTipoEmpresa} id="idTipo" required>
                        {tipos?.map(option => {
                            return (<MenuItem value={option.idTipo}> {option.tipo} </MenuItem>);
                        })}
                    </TextField>
                </FormControl>
            );
        }
        return vista;
    };

    const addNewPerson = async (index, data) => {

        if (data !== null) {
            if (data.inputValue !== undefined) {
                inputFields[index].idPersona = 0;
                inputFields[index].dui = '';
                inputFields[index].nombre = data.inputValue;
                setStateInputDui(false);
            } else {
                inputFields[index].idPersona = data.idPersona;
                inputFields[index].dui = data.dui;
                inputFields[index].nombre = data.nombre;
            }
        } else {
            inputFields[index].idPersona = '';
            inputFields[index].dui = '';
            inputFields[index].nombre = '';
            setStateInputDui(true);
        }
        setInputFields(inputFields);
    };

    const handleAddFields = (index) => {
        const values = [...inputFields];
        var id = values[index]['idPersona']
        if (id === '') {
            toast.error("seleccione un nombre antes de agregar otro espacio")
        } else {
            if (values.length === 5) {
                setStateBtnAdd(true);
                toast.error("el maximo de Personas para una solicitud es 5");
            } else {
                setStateBtnDelete(false);

                values.push({
                    idPersona: '',
                    nombre: '',
                    dui: ''
                });

                if (id !== 0) {
                    for (const i in personas) {
                        if (personas[i]['idPersona'] === id) {
                            delete personas[i]
                        }
                    }
                    setPersonas(personas)
                }
                setInputFields(values);
            }
        }
    };

    const handleRemoveFields = index => {
        const values = [...inputFields];

        if (values[index]['idPersona'] !== 0) {
            personas.push(values[index]);
            setPersonas(personas);
        }
        delete values[index];
        var valuesLimpio = values.filter(function (e) { return e != null; });

        setInputFields(valuesLimpio);

        if (valuesLimpio.length === 1) {
            setStateBtnDelete(true);
        } else {
            setStateBtnAdd(false);
        }
    };


    const addSol = async () => {

        var time = fechaI.getHours() + ':' + fechaI.getMinutes() + ':00';
        var fechaIngreso = fechaI.toISOString().substr(0, 10);
        solicitud.fechayHoraVisita = fechaIngreso.split("-").reverse().join("-") + ' ' + time;

        solicitud.idUsuario = userStore.idUsuario;

        var index = inputFields.length;
        index = index - 1;

        if (valueEmpresa === null) {
            toast.error("Campo requerido! Seleccione o escriba el nombre de la empresa")
        } else if (motivo.trim() === "") {
            toast.error("Campo Requerido! Ingrese un motivo")
        } else if (idArea === "") {
            toast.error("Campo Requerido! Seleccione una Oficina")
        } else if (time >= '17:00:00' && time <= '7:59:00') {
            toast.error("La hora de ingreso solo es valida entre las 08:00 AM y las 05:00 PM");
        } else if (inputFields[index]['idPersona'] === '') {
            toast.error("Ingrese nombre y documento de identidad del visitante");
        } else {
            if (idTipoEmpresa === "") {
                solicitud.idTipoEmpresa = valueEmpresa.idTipo;
                solicitud.idEmpresa = valueEmpresa.idEmpresa;
                solicitud.empresa = valueEmpresa.nombre;
            } else {
                solicitud.empresa = valueEmpresa.nombre;
                solicitud.idEmpresa = 0;
            }
            solicitud.personas = inputFields;
            try {
                var result = await addSolicitudVisitas(solicitud);
                toast.success(result.data['capacidad']);
                setTimeout(() => {
                    history.push('../solicitudes');
                }, 4000);
            } catch (error) {
                if (error.request.response !== '') {
                    var notificacion = error.request.response.split(":");
                    notificacion = notificacion[1].split("}");
                    toast.error(notificacion[0]);
                    setSolicitud(initialValue);
                    setValueFI(new Date());
                } else {
                    toast.error("ERROR NETWORK, no se obtuvo respuesta con el servidor");
                }
            }
        }
    };

    const cancelAccion = async () => {
        setSolicitud(initialValue);
        setInputFields(initialPerson);
        setValuePersona(null);
        setPersonas([]);
        history.push('../solicitudes');
    };


    const onValueChange = (e) => {
        setSolicitud({ ...solicitud, [e.target.name]: e.target.value })
    };

    const onValueChangeDocIdentidad = (index, e) => {
        const values = [...inputFields];
        values[index].dui = e.target.value
        setInputFields(values);
    }

    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <FormGroup className={classes.container}>
                <div><Toaster /></div>
                <Typography align="center" variant="h4">Crear Solicitud Visitantes</Typography>
                <FormControl>
                    <Autocomplete
                        value={valueEmpresa}
                        onChange={(event, newValue) => {
                            if (typeof newValue === 'string') {
                                setValue({ nombre: newValue, });
                            } else if (newValue && newValue.inputValue) {
                                // Create a new value from the user input
                                setValue({ nombre: newValue.inputValue, });
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
                                filtered.push({ inputValue, nombre: `Add "${inputValue}"`, });
                                setAction(false);
                            }
                            return filtered;
                        }}
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
                        renderInput={(params) => (
                            <TextField {...params} label="Escriba el nombre de la empresa" />
                        )}
                    />
                </FormControl>
                {viewTipoE(action)}
                <FormControl>
                    <TextField
                        label="Motivo"
                        variant="outlined"
                        onChange={(e) => onValueChange(e)} name="motivo" value={motivo} id="motivo"
                        required
                        inputProps={{ maxLength: 40 }}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        select
                        label="Seleccione una Oficina"
                        onChange={(e) => onValueChange(e)} name="idArea" value={idArea} id="idArea"
                        required>
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
                            inputFormat="dd-MM-yyyy hh:mm a"
                            autoFocus
                            minDateTime={new Date()}
                            onChange={(newValue) => {
                                setValueFI(newValue);
                            }}
                            renderInput={(params) => <TextField {...params} />}
                        />
                    </LocalizationProvider>
                </FormControl>
                {inputFields.map((inputField, index) => (
                    <Stack direction="row" justifyContent="center" spacing={4} key={`${inputField}~${index}`}>
                        <Autocomplete
                            value={inputField.nombre}
                            onChange={(event, newValue) => {
                                if (typeof newValue === 'string') {
                                    setValuePersona({
                                        nombre: newValue,
                                    });
                                } else if (newValue && newValue.inputValue) {
                                    // Create a new value from the user input
                                    setValuePersona({
                                        nombre: newValue.inputValue,
                                    });
                                    addNewPerson(index, newValue);
                                } else {
                                    setValuePersona(newValue);
                                    addNewPerson(index, newValue);
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
                            options={personas}
                            sx={{ width: 300 }}
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
                            renderInput={(params) => (
                                <TextField {...params} label="Nombre del Visitante" />
                            )}
                        />
                        <TextField
                            label="Documento de Identidad"
                            variant="outlined"
                            value={inputField.dui}
                            onChange={(e) => onValueChangeDocIdentidad(index, e)} name="dui" id="dui"
                            required
                            sx={{ width: 300 }}
                            inputProps={{ maxLength: 20, readOnly: stateInputDui }}
                        />

                        <IconButton color="inherit" edge="start" disabled={stateBtnDelete} onClick={() => handleRemoveFields(index)}><RemoveIcon /></IconButton>
                        <IconButton color="inherit" edge="start" disabled={stateBtnAdd} onClick={() => handleAddFields(index)}><AddIcon /></IconButton>
                    </Stack>
                ))}
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => addSol()}>Ingresar solicitud</Button>
                    <Button variant="contained" color="secondary" style={{ marginTop: 10 }} onClick={() => cancelAccion()}>Cancelar</Button>
                </FormControl>
            </FormGroup>
        </ThemeProvider>
    );
}

export default CrearSolicitudExternos;