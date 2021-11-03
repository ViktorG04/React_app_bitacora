import React, { useState, useEffect, useContext } from 'react';
import { MenuItem, FormGroup, FormControl, Button, makeStyles, Typography } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { buscarSolicitudes, editSolicitud, getOficinas, getEstados } from '../../config/axios';
import { useHistory, useParams } from "react-router-dom";
import UserLoginContext from '../../context/login/UserLoginContext';
import decrypt from '../../utils/decrypt';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const initialValue = {
    nombreCompleto: '',
    fechaVisita: '',
    motivo: '',
    idArea: '',
    idEstado: ''
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

const EditarSolicitud = () => {
    const [solicitud, setSolicitud] = useState(initialValue);
    const [fechaI, setValueFI] = useState(new Date());
    const [areas, setAreas] = useState([]);
    const [estados, setEstados] = useState([]);
    const { motivo, idArea, idEstado } = solicitud;

    //datos guardados en Localstorage
    const userStateEncrypt = useContext(UserLoginContext);
    const userStore = JSON.parse(decrypt(userStateEncrypt.userLogin));

    const { id } = useParams();
    const classes = useStyles();

    const history = useHistory();

    useEffect(() => {
        async function loadSolicitudDetails() {
            const response = await buscarSolicitudes(id);
            setSolicitud(response.data);
            setValueFI(response.data['fechaVisita'])
        };
        loadSolicitudDetails();

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


        async function getAllEstados() {
            const response = await getEstados();
            delete response.data[0];
            delete response.data[1];
            setEstados(response.data);
        };
        getAllEstados();

    }, []);

    const onValueChange = (e) => {
        //console.log(e.target.value);
        setSolicitud({ ...solicitud, [e.target.name]: e.target.value })
    }

    const editSolicitudDetails = async () => {
        console.log(solicitud)
        //  const response = await editSolicitud(solicitud);
        //history.push('/all');
    }

    return (
        <FormGroup className={classes.container}>
            <div><Toaster /></div>
            <Typography align="center" variant="h4">Editar Solicitud</Typography>
            <FormControl>
                <TextField
                    label="Empleado"
                    variant="outlined"
                    defaultValue={userStore.nombreCompleto}
                    InputProps={{ readOnly: true }}
                />
            </FormControl>
            <FormControl>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        value={fechaI}
                        label="Fecha y Hora Visita"
                        autoFocus
                        onChange={(newValue) => {
                            setValueFI(newValue);
                        }}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </LocalizationProvider>
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
                <TextField
                    select
                    label="Seleccione una Oficina"
                    onChange={(e) => onValueChange(e)} name="idEstado" value={idEstado} id="idEstado" required>
                    {estados?.map(option => {
                        return (<MenuItem value={option.idEstado}> {option.estado} </MenuItem>);
                    })}
                </TextField>
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => editSolicitudDetails()}>Guardar Cambios</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../solicitudes`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}

export default EditarSolicitud;