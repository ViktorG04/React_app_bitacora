import { useState, useEffect, useContext, Fragment } from 'react';
import { MenuItem, FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
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

const initialValue = {
    idUsuario: '',
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
    const [valueEmpresa, setValue] = useState(null);
    const [valuePersona, setValuePersona] = useState(null);
    const [valueDui, setValueDui] = useState(null);

    const [inputFields, setInputFields] = useState([
        { firstName: '', lastName: '' }
    ]);

    //determina si un campo es editable o no
    const [action, setAction] = useState(true);

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

    const onValueChange = (e) => {
        setSolicitud({ ...solicitud, [e.target.name]: e.target.value })
    };

    const handleSubmit = e => {
        e.preventDefault();
        console.log("inputFields", inputFields);
    };

    const handleAddFields = () => {
        const values = [...inputFields];
        values.push({ firstName: '', lastName: '' });
        setInputFields(values);
    };

    const handleRemoveFields = index => {
        const values = [...inputFields];
        values.splice(index, 1);
        setInputFields(values);
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

        solicitud.idUsuario = userStore.idUsuario;

        if (idTipo === "") {
            solicitud.idTipo = valueEmpresa.idTipo;
            solicitud.idEmpresa = valueEmpresa.idEmpresa;
            solicitud.empresa = valueEmpresa.nombre;
        } else {
            solicitud.empresa = valueEmpresa.nombre;
            solicitud.idEmpresa = 0;
        }


        console.log(solicitud);
        /*
        var time = fechaI.getHours() + ':' + fechaI.getMinutes() + ':00';
        var fechaIngreso = fechaI.toISOString().substr(0, 10);
        solicitud.fechayHoraVisita = fechaIngreso.split("-").reverse().join("-") + ' ' + time;

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
        } else {
            try {
                console.log(solicitud);
                //    var result = await addSolicitud(solicitud);
                //    console.log(result.data);
                //  history.push('../solicitudes');

            } catch (error) {
                var notificacion = error.request.response.split(":");
                notificacion = notificacion[1].split("}");
                toast.error(notificacion[0]);
            }

        }*/
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


    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <FormGroup className={classes.container}>
                <div><Toaster /></div>
                <Typography align="center" variant="h4">Crear Solicitud Visitantes</Typography>
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
                            autoFocus
                            minDateTime={new Date()}
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
                        options={personas}
                        getOptionLabel={(option) => option.nombreCompleto}
                        onChange={(newValue) => {
                            setValuePersona(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Nombre del Visitante" />}
                    />
                </FormControl>
                <FormControl>
                    <Autocomplete
                        disablePortal
                        options={personas}
                        getOptionLabel={(option) => option.docIdentidad}
                        onChange={(newValue) => {
                            setValuePersona(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} label="Documento del visitante" />}
                    />
                </FormControl>
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => addSol()}>Ingresar solicitud</Button>
                    <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../solicitudes`}>Cancelar</Button>
                </FormControl>
            </FormGroup>
        </ThemeProvider>
    );
}

export default CrearSolicitudExternos;