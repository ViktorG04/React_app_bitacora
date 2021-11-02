import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getSolicitudes } from '../../config/axios';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    container:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '60px'
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
    //const [action, setAction] = useState(false);
    const classes = useStyles();


    useEffect(() => {
        getAllSolicitudes();
    }, []);

    const getAllSolicitudes = async () => {
        let response = await getSolicitudes();
     
        setSolicitudes(response.data);
    }
    return (
        <div className={classes.container}>
            <h2>Solicitudes creadas</h2>
            <Button variant="outlined" onClick={() => history.push("/crearsolicitud") }>Crear solicitud</Button>
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
                            <Button color="primary" variant="contained" style={{marginRight:10}} component={Link} to={`/editarsolicitud/${sol.idSolicitud}`} >Editar</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
}   

export default Solicitudes;