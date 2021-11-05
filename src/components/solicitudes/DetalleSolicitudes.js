import React, { useState, useEffect, useContext } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography, MenuItem, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { buscarSolicitudes, addIngreso, getEstados, getOficinas } from '../../config/axios';
import TextField from '@mui/material/TextField';
import { useHistory, useParams } from "react-router-dom";
import UserLoginContext from '../../context/login/UserLoginContext';
import decrypt from '../../utils/decrypt';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { Box } from '@mui/system';

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

/*const valuePersona = {
    idDetalle: '',
    nombreCompleto: '',
    docIdentidad: '',
    sintomas: '',
    diagnosticado: '',
    covidFamiliar: '',
    viajo: ''
}*/

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

    const [solicitud, setSolicitud] = useState(valueSolicitud);
    const [personas, setPersonas] = useState([]);
    const [personaIngreso, setPersonaIngreso] = useState(null);

    const [areas, setAreas] = useState([]);
    const [estados, setEstados] = useState([]);
    const [actionEstado, setActionEstado] = useState(false);

    const classes = useStyles();
    const history = useHistory();


    //datos guardados en Localstorage
    const userStateEncrypt = useContext(UserLoginContext);
    const userStore = JSON.parse(decrypt(userStateEncrypt.userLogin));


    const loadSolicitudDetails = async () => {
        const response = await buscarSolicitudes(id);
        setSolicitud(response.data);
        setPersonas(response.data['personas']);


        const result = await getEstados();

        var data = [];

        if (response.data['idEstado'] === 6) {
            data.push(result.data[5]);
            data.push(result.data[6]);
        } else {
            data.push(result.data[3]);
            setActionEstado(true);
        }
        setEstados(data);

    }

    const updateSolicitud = async () => {
        //  const response = await editSolicitud(solicitud);
        //history.push('/all');
        var data = {};
        var detalle = [];
        var temp, bandera;
        for (const i in personaIngreso) {
                temp = parseFloat(personaIngreso[i])
            if ( temp >= 37) {
                toast.error("El maximo de temperatura permitido es 36.9°")
                bandera = 1;
            } else {
                data = { "idDetalle": i, "temperatura": personaIngreso[i] }
                detalle.push(data);
            }
        }

        if(bandera !== 1){
            try {
                const result = await addIngreso({ "idSolicitud": solicitud.idSolicitud, "personas": detalle });
                console.log(result.data['msj']) 
                    history.push("../solicitudes");
                
            } catch (error) {
                var notificacion = error.request.response.split(":");
            notificacion = notificacion[1].split("}");
            toast.error(notificacion[0]);
            }
        }

       

        
    }

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




    return (
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
                    onChange={(e) => onValueChange(e)} name="idArea" value={solicitud.idArea} id="idArea"
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
                    value={solicitud.motivo} id="motivo"
                />
                <TextField
                    select
                    label="Estado de la Solicitud"
                    onChange={(e) => onValueChange(e)} name="idEstado" value={solicitud.idEstado} id="idEstado" InputProps={{ readOnly: actionEstado }}>
                    {estados?.map(option => {
                        return (<MenuItem value={option.idEstado}> {option.estado} </MenuItem>);
                    })}
                </TextField>
            </Box>
            <Table>
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
                            <TableCell>{per.docIdentidad}</TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    name={per.idDetalle.toString()}
                                    value={per.temperatura}
                                    onChange={(e) => onValueChange(e)}
                                    inputProps={{ step: "0.01", min: 30, max: 36, }}
                                    style={{ width: '12ch' }}
                                    placeholder="0.00"
                                />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <FormControl>
                <Button variant="contained" color="primary" onClick={() => updateSolicitud()}>Ingresar</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../solicitudes`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}
export default DetalleSolicitud;