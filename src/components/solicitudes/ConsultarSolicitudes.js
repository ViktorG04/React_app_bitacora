import React, { useState, useEffect, useContext } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getSolicitudes } from '../../config/axios';
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";
import UserLoginContext from '../../context/login/UserLoginContext';
import decrypt from '../../utils/decrypt';

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
    const classes = useStyles();

    const userStateEncrypt = useContext(UserLoginContext);
    const userStore = JSON.parse(decrypt(userStateEncrypt.userLogin));

    useEffect(() => {
        async function getAllSolicitudes() {
            let response = await getSolicitudes(userStore.idUsuario);
            setSolicitudes(response.data);

        };
        getAllSolicitudes();

        if (userStore.idRol !== 3) {
            setAction(false);
        }

    }, [userStore.idRol, userStore.idUsuario]);

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
                <Table className={classes.table}>
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


    return (
        <div className={classes.container}>
            <Button variant="outlined" onClick={() => redireccionar()} disabled={action}>Crear solicitud</Button>
            {vistaDetalle()}
        </div>
    );
}

export default Solicitudes;