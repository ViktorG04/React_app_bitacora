import React, { useState, useEffect, useContext } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles, TextField } from '@material-ui/core'
import { getSolicitudByDate, getSolicitudes } from '../../config/axios';
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";
import UserLoginContext from '../../context/login/UserLoginContext';
import decrypt from '../../utils/decrypt';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '80px'
    },
    table: {
        width: '100%',
        margin: '20px 0px'
    },
    thead: {
        '& > *': {
            fontSize: 20,
            background: '#cccc',
            color: '#000000'
        }
    },
    row: {
        '& > *': {
            fontSize: 18
        }
    }
})

const Solicitudes = () => {
    const history = useHistory();
    const [solicitudes, setSolicitudes] = useState([]);
    const [action, setAction] = useState(true);
    //usuario logeado
    const userStateEncrypt = useContext(UserLoginContext);
    const userStore = JSON.parse(decrypt(userStateEncrypt.userLogin));

    //name button
    const [nameButton, setNameButton] = useState("BUSCAR");

    //accion fecha
    const [fechaI, setValueFI] = useState(null);

    const classes = useStyles();

    useEffect(() => {
        getAllSolicitudes();

        if (userStore.idRol !== 3) {
            setAction(false);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getAllSolicitudes() {
        let response = await getSolicitudes(userStore.idUsuario);
        let vacio = [];
        if (response.data === "") {
            setSolicitudes(vacio);
        } else {
            setSolicitudes(response.data);
        }

    };

    const redireccionar = async () => {

        if (userStore.idRol === 1) {
            history.push("/crearsolicitudexternos")
        }
        else {
            history.push("/crearsolicitud")
        }
    };

    const verDetalle = async (idSolicitud, idEstado) => {

        if (userStore.idRol !== 2) {
            if (userStore.idRol === 1 && (idEstado === 3 || idEstado === 5)) {
                history.push(`/editarsolicitud/${idSolicitud}`)
            } else {
                history.push(`/ingresarPersonas/${idSolicitud}`)
            }

        } else {
            history.push(`/editarsolicitud/${idSolicitud}`)
        }
    };

    const buscarPorFecha = async () => {
        var fecha = fechaI.toISOString().substr(0, 10);
        
        if(nameButton === "BUSCAR" && fecha !== null){
           //hacer consulta a la db
           console.log(fecha);
           var result = await getSolicitudByDate({fecha});
           setSolicitudes(result.data);
         
            setNameButton("LIMPIAR");
        }else{
            setNameButton("BUSCAR");
            setValueFI(null);
            getAllSolicitudes();
         }
         
    };

    const vistaDetalle = () => {
        var vista;
        if (userStore.idRol === 2) {
            vista = (
                <Table className={classes.table}>
                    <TableHead>
                        <TableRow className={classes.thead}>
                            <TableCell>Solicitud</TableCell>
                            <TableCell>Fecha de Visita</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {solicitudes.map((sol) => (
                            <TableRow className={classes.row} key={sol.idSolicitud}>
                                <TableCell>{sol.idSolicitud}</TableCell>
                                <TableCell>{sol.fechaVisita}</TableCell>
                                <TableCell>{sol.estado}</TableCell>
                                <TableCell>
                                    <Button color="primary" variant="contained" onClick={() => verDetalle(sol.idSolicitud, sol.idEstado)}>Ver</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>)
        } else {
            vista = (
                <Table>
                    <TableHead>
                        <TableRow className={classes.thead}>
                            <TableCell>Solicitud</TableCell>
                            <TableCell>Solicitante</TableCell>
                            <TableCell>Fecha de Visita</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {solicitudes.map((sol) => (
                            <TableRow className={classes.row} key={sol.idSolicitud}>
                                <TableCell>{sol.idSolicitud}</TableCell>
                                <TableCell>{sol.nombreCompleto}</TableCell>
                                <TableCell>{sol.fechaVisita}</TableCell>
                                <TableCell>{sol.estado}</TableCell>
                                <TableCell>
                                    <Button color="primary" variant="contained" onClick={() => verDetalle(sol.idSolicitud, sol.idEstado)}>Ver</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>)
        }
        return vista;
    };

    const vistaBotones = () => {
        var botones;
        if (userStore.idRol === 2 || userStore.idRol === 1) {
            if (userStore.idRol === 1) {
                botones = (
                    <Box className={classes.container}>
                        <Stack spacing={4} direction="row" >
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    value={fechaI}
                                    label="Buscar por Fecha"
                                    autoFocus
                                    minDate={new Date('2021-10-01')}
                                    onChange={(newValue) => {
                                        setValueFI(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <Button variant="outlined" onClick={() => buscarPorFecha()} style={{ marginTop: 10 }}>{nameButton}</Button>
                            <Button variant="outlined" onClick={() => redireccionar()} disabled={action} style={{ marginLeft: "auto", marginTop: 10 }}>Crear solicitud</Button>
                        </Stack>
                        <div style={{ marginTop: 10 }}>{vistaDetalle()}</div>
                    </Box>
                );
            } else {
                botones = (
                    <Box className={classes.container}>
                        <Button variant="outlined" onClick={() => redireccionar()} disabled={action}>Crear solicitud</Button>
                        <div>{vistaDetalle()}</div>
                    </Box>
                )
            }
        }
        else {
            botones = (
                <Box className={classes.container}>
                    <div>{vistaDetalle()}</div>
                </Box>
            )
        }
        return botones;
    }


    return (
        <div> {vistaBotones()}</div>
    );
}

export default Solicitudes;