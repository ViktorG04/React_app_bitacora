import { useState, useEffect, useContext } from 'react';
import { MenuItem, FormGroup, FormControl, Button, makeStyles, Typography, IconButton } from '@material-ui/core';
import { addSolicitud, getEmpresas, getOficinas, getPersonasExternos, getTipos } from '../../config/axios';
import { useHistory } from "react-router-dom";
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { Link } from 'react-router-dom';
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
    idTipo: '',
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
    const [valuePersona, setValuePersona] = useState([]);
    const [valueDui, setValueDui] = useState(null);

    const [inputFields, setInputFields] = useState([initialPerson]);

    const [numClick, setNumClick] = useState(1);

    //determina si un campo es editable o no
    const [action, setAction] = useState(true);


    //editable agregar persona
    const [stateBtnAdd, setStateBtnAdd] = useState(false);

    //editable eliminar persona
    const [stateBtnDelete, setStateBtnDelete] = useState(true);

    const { motivo, idArea, idTipo } = solicitud;


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
                        onChange={(e) => onValueChange(e)} name="idTipo" value={idTipo} id="idTipo" required>
                        {tipos?.map(option => {
                            return (<MenuItem value={option.idTipo}> {option.tipo} </MenuItem>);
                        })}
                    </TextField>
                </FormControl>
            );
        }

        return vista;
    };


    const handleAddFields = () => {
        const values = [...inputFields];

        var num = numClick + 1;

        setNumClick(num);


        if (valuePersona === null) {
            toast.error("seleccione un nombre antes de agregar otro espacio")
        } else {
            if (values.length === 5) {
                setStateBtnAdd(true);
                toast.error("el maximo de Personas para una solicitud es 5");
            } else {
                setStateBtnDelete(false);
                const values = [...inputFields];
                if (valuePersona.idPersona === undefined) {
                    values.push({
                        idPersona: 0,
                        nombre: valuePersona.nombre,
                        dui: ''
                    })

                } else {
                    values.push({
                        idPersona: valuePersona.idPersona,
                        nombre: valuePersona.nombre,
                        dui: valuePersona.dui
                    });

                    for (const i in personas) {
                        if (personas[i]['idPersona'] === valuePersona.idPersona) {
                            delete personas[i]
                        }
                    }
                    setPersonas(personas)
                }
                setInputFields(values);
                setValuePersona(null);
            }
        }
    };

    const handleRemoveFields = index => {
        const values = [...inputFields];
        if (values.length === 2) {
            setStateBtnDelete(true);
        }
        setStateBtnAdd(false);
        values.splice(index, 1);
        setInputFields(values);
    };

    const viewDocIdentidad = async (data) => {

        console.log(data);
    }



    const addSol = async () => {

        var time = fechaI.getHours() + ':' + fechaI.getMinutes() + ':00';
        var fechaIngreso = fechaI.toISOString().substr(0, 10);
        solicitud.fechayHoraVisita = fechaIngreso.split("-").reverse().join("-") + ' ' + time;

        solicitud.idUsuario = userStore.idUsuario;
        var flag = 0;

        if (idTipo === "") {
            solicitud.idTipo = valueEmpresa.idTipo;
            solicitud.idEmpresa = valueEmpresa.idEmpresa;
            solicitud.empresa = valueEmpresa.nombre;
        } else {
            solicitud.empresa = valueEmpresa.nombre;
            solicitud.idEmpresa = 0;
        }

        if (fechaI === Date()) {
            toast.error("Campo Requerido! Ingrese una fecha valida");
        } else if (time >= '17:00:00' && time <= '7:59:00') {
            toast.error("La hora de ingreso solo es valida entre las 08:00 AM y las 05:00 PM");
        } else if (motivo.trim() === "") {
            toast.error("Campo Requerido! Ingrese un motivo")
        } else if (idArea === "") {
            toast.error("Campo Requerido! Seleccione una Oficina")
        } else if (valueEmpresa === null) {
            toast.error("Campo requerido! Seleccione o escriba el nombre de la entidad")
        } else if(inputFields.length === 1 && valuePersona === null){
            toast.error("Ingrese un nombre y documento del visitante");
        }else if( inputFields.length === 1 && valuePersona !== null ){
            inputFields.push(valuePersona);
        }else if (numClick === 1){
            if(valuePersona !== null){
                inputFields.push(valuePersona);
            }else{
                toast.error("Ingrese un nombre y documento del visitante");
            }
        } else {

            var data = inputFields;
            delete data[0];
            var personas = data.filter(function (e) { return e != null; })

            for (const i in personas) {
                if (personas[i]['idPersona'] === valuePersona['idPersona']) {
                } else {
                    flag = 1;
                }
            }
            if (flag !== 0) {
                personas.push(valuePersona);
            }

        }


        solicitud.personas = personas;

        console.log(solicitud);

    };


    const onValueChange = (e) => {
        setSolicitud({ ...solicitud, [e.target.name]: e.target.value })
    };

    const onValueChangeDocIdentidad = (e) => {
        setValueDui({ ...valueDui, [e.target.name]: e.target.value })
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
                    <Stack direction="row" justifyContent="center" alignItems="baseline" spacing={2} key={`${inputField}~${index}`}>
                        <Autocomplete
                            value={inputField.nombreCompleto}
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
                                } else {
                                    setValuePersona(newValue);
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

                        <IconButton color="inherit" edge="start" disabled={stateBtnDelete} onClick={() => handleRemoveFields()}><RemoveIcon /></IconButton>
                        <IconButton color="inherit" edge="start" disabled={stateBtnAdd} onClick={() => handleAddFields()}><AddIcon /></IconButton>
                    </Stack>
                ))}
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => addSol()}>Ingresar solicitud</Button>
                    <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../solicitudes`}>Cancelar</Button>
                </FormControl>
            </FormGroup>
        </ThemeProvider>
    );
}

export default CrearSolicitudExternos;