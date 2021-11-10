import React, { useState, useEffect, useContext } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography, MenuItem, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { buscarSolicitudes, getEstados, getOficinas } from '../../config/axios';
import TextField from '@mui/material/TextField';
import { useHistory, useParams } from "react-router-dom";
import UserLoginContext from '../../context/login/UserLoginContext';
import decrypt from '../../utils/decrypt';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';
import { IngresarPersonas, updateEstado } from './logicDetalle';
import { Stack } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'

const valueSolicitud = {
    idSolicitud: '',
    idUsuario: '',
    nombreCompleto: '',
    fechaVisita: '',
    motivo: '',
    idArea: '',
    idEstado: '',
    estado: '',
    empresa: '',
    personas: []
}

const useStyles = makeStyles({
    container: {
        width: '50%',
        margin: '5% 0 0 25%',
        '& > *': {
            marginTop: 8
        }
    }
})

const DetalleSolicitud = () => {
    //id que viene de listarsolicitudes
    const { id } = useParams();

    //llenar objetos del detalle solicitud
    const [solicitud, setSolicitud] = useState(valueSolicitud);
    const [personas, setPersonas] = useState([]);

    //obtener temperatura
    const [personaIngreso, setPersonaIngreso] = useState(null);

    //obetener datos oficinas y estados
    const [areas, setAreas] = useState([]);
    const [estados, setEstados] = useState([]);

    //nombre boton
    const [nameButton, setNameButton] = useState("INGRESAR PERSONAS");

    //disable
    const [actionEstado, setActionEstado] = useState(false);
    const [actionTemp, setActionTemp] = useState(false);

    const classes = useStyles();
    const history = useHistory();


    //datos guardados en Localstorage
    const userStateEncrypt = useContext(UserLoginContext);
    const userStore = JSON.parse(decrypt(userStateEncrypt.userLogin));


    //informacion de solicitud
    const loadSolicitudDetails = async () => {
        const response = await buscarSolicitudes(id);
        var dataS = response.data;
        var dataP = response.data['personas']
        var dataE = [];
        setSolicitud(dataS);
        setPersonas(dataP);

        const result = await getEstados();
        result.data[6]['estado'] = 'Finalizar';

        if (userStore.idRol === 3) {
            if (dataS['idEstado'] === 6) {
                dataE.push(result.data[5]);

                dataE.push(result.data[6]);
                setNameButton("FINALIZAR SOLICITUD")
            } else {
                dataE.push(result.data[3]);
                setActionEstado(true);
            }

        } else {
            //perfil rrhh
            if (dataS['idEstado'] === 4) {
                dataE.push(result.data[3]);
                dataE.push(result.data[7]);
            } else if (dataS['idEstado'] === 6) {
                dataE.push(result.data[5]);
                dataE.push(result.data[6]);
                setNameButton("FINALIZAR SOLICITUD")
            } else {
                dataE.push(result.data[7]);
                setActionTemp(true);
                setActionEstado(true);
            }
        }
        setEstados(dataE);

    };


    //action button
    const updateSolicitud = async () => {
        var ingreso, estado;

        if (solicitud.idEstado === 7 || solicitud.idEstado === 8) {
            if (solicitud.idEstado === 7) {
                estado = "FINALIZAR";
            } else {
                estado = "CANCELAR";
            }

            toast((t) => (
                <span>
                    <h3><b>HA SELECCIONADO {estado} LA SOLICITUD</b></h3>
                    ¿Esta seguro de querer realizar esta accion?
                    <Stack spacing={2} direction="row">
                        <button onClick={() => updateEstado(userStore.idUsuario, solicitud.idSolicitud, solicitud.idEstado)}>SI </button>
                        <button onClick={() => toast.dismiss(t.id)}>NO</button>
                    </Stack>
                </span >
            ));
        } else {

            if (personaIngreso === null) {
                toast.error("Campo Requerido! No ha Ingreso Temperatura")
            } else {
                ingreso = await IngresarPersonas(personaIngreso, solicitud.idSolicitud);
                if (ingreso !== undefined) {
                    history.push("../solicitudes");
                }
            }
        }
    };

    //cambiar nombre del boton segun el estado seleccionado
    const changeNameButton = async (estado) => {

        if (estado === 8) {
            setNameButton("CANCELAR SOLICITUD");
            setActionTemp(true);
        } else if (estado === 7) {
            setNameButton("FINALIZAR SOLICITUD");
        } else if (estado === 6) {
            setNameButton("FINALIZAR SOLICITUD");
        } else {
            setNameButton("INGRESAR PERSONAS");
            setActionTemp(false);
        }
    };

    useEffect(() => {
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const onValueChange = (e) => {
        setPersonaIngreso({ ...personaIngreso, [e.target.name]: e.target.value })
    }

    const onValueChangeSolicitud = (e) => {
        setSolicitud({ ...solicitud, [e.target.name]: e.target.value })
        changeNameButton(e.target.value);
    }

    const vistaTabla = () => {
        var vista;
        if (solicitud.idEstado === 4 || solicitud.idEstado === 8) {
            vista = (<Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre Completo</TableCell>
                        <TableCell>Documento Identidad</TableCell>
                        <TableCell>Temperatura</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {personas.map((per) => (
                        <TableRow>
                            <TableCell>{per.nombreCompleto}</TableCell>
                            <TableCell  >{per.docIdentidad}</TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    name={per.idDetalle.toString()}
                                    value={per.temperatura}
                                    onChange={(e) => onValueChange(e)}
                                    inputProps={{ step: "0.01", min: 30, max: 36, }}
                                    style={{ width: '12ch' }}
                                    placeholder="0.00"
                                    InputProps={{ readOnly: actionTemp }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>);
        } else {
            vista = (<Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Nombre Completo</TableCell>
                        <TableCell>Documento Identidad</TableCell>
                        <TableCell>Hora Ingreso </TableCell>
                        <TableCell>Hora Salida</TableCell>
                        <TableCell>Temperatura</TableCell>

                    </TableRow>
                </TableHead>
                <TableBody>
                    {personas.map((per) => (
                        <TableRow>
                            <TableCell>{per.nombreCompleto}</TableCell>
                            <TableCell>{per.docIdentidad}</TableCell>
                            <TableCell>{per.horaIngreso}</TableCell>
                            <TableCell>{per.horaSalida}</TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    name={per.idDetalle.toString()}
                                    value={per.temperatura}
                                    onChange={(e) => onValueChange(e)}
                                    inputProps={{ step: "0.01", min: 30, max: 36, }}
                                    style={{ width: '12ch' }}
                                    placeholder="0.00"
                                    InputProps={{
                                        readOnly: action => {
                                            if (per.temperatura !== undefined) {
                                                action = false;
                                            } else {
                                                action = true;
                                            }
                                        }
                                    }}
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>);
        }
        return vista;
    };

    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <FormGroup className={classes.container}>
                <div><Toaster /></div>
                <Typography align="center" variant="h4">Solicitud N°{solicitud.idSolicitud}</Typography>
                <Box
                    component="form"
                    sx={{ '& > :not(style)': { m: 1, width: '32ch' }, }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        label="Solicitante"
                        variant="outlined"
                        value={solicitud.nombreCompleto}
                    />
                    <TextField
                        label="Fecha y Hora Ingreso"
                        variant="outlined"
                        onChange={(e) => onValueChangeSolicitud(e)}
                        value={solicitud.fechaVisita}
                    />
                </Box>
                <Box component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '32ch' },
                    }}
                    noValidate
                    autoComplete="off"
                >
                    <TextField
                        label="Empresa"
                        variant="outlined"
                        value={solicitud.empresa}
                        InputProps={{ readOnly: true }}
                    />
                    <TextField
                        select
                        label="Oficinas"
                        onChange={(e) => onValueChangeSolicitud(e)} name="idArea" value={solicitud.idArea} id="idArea"
                        InputProps={{ readOnly: true }}>
                        {areas?.map(option => {
                            return (<MenuItem value={option.idArea}> {option.descripcion} </MenuItem>);
                        })}
                    </TextField>
                </Box>
                <Box component="form"
                    sx={{
                        '& > :not(style)': { m: 1, width: '32ch' },
                    }}
                    noValidate
                    autoComplete="off">
                    <TextField
                        label="Motivo"
                        variant="outlined"
                        onChange={(e) => onValueChangeSolicitud(e)}
                        value={solicitud.motivo} id="motivo"
                    />
                    <TextField
                        select
                        label="Estado de la Solicitud"
                        onChange={(e) => onValueChangeSolicitud(e)}
                        name="idEstado" value={solicitud.idEstado} id="idEstado"
                        InputProps={{ readOnly: actionEstado }}

                    >
                        {estados?.map(option => {
                            return (<MenuItem value={option.idEstado}> {option.estado} </MenuItem>);
                        })}
                    </TextField>
                </Box>
                {vistaTabla()}
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => updateSolicitud()}>{nameButton}</Button>
                    <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../solicitudes`}>Cancelar</Button>
                </FormControl>
            </FormGroup>
        </ThemeProvider>
    );
}
export default DetalleSolicitud;