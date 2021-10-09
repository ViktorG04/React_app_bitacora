import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getSolicitudes } from '../config/axios';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    table: {
        width: '90%',
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
    const [solicitudes, setSolicitudes] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        getAllSolicitudes();
    }, []);

    const deleteSolicitud = async (idSolicitud) => {
        await deleteSolicitud(idSolicitud);
        getAllSolicitudes();
    }

    const getAllSolicitudes = async () => {
        let response = await getSolicitudes();
        console.log(response.data)
        setSolicitudes(response.data);
    }
    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow className={classes.thead}>
                    <TableCell>Id Solicitud</TableCell>
                    <TableCell>fecha de visita</TableCell>
                    <TableCell>Estado</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {solicitudes.map((sol) => (
                    <TableRow className={classes.row} key={sol.idSolicitud}>
                        <TableCell>{sol.idSolicitud}</TableCell>
                        <TableCell>{sol.fechaVisita}</TableCell>
                        <TableCell>{sol.estado}</TableCell>
                        <TableCell>
                            <Button color="primary" variant="contained" style={{marginRight:10}} component={Link} to={`/editarsolicitud/${sol.idSolicitud}`}>Editar</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}   
 
export default Solicitudes;