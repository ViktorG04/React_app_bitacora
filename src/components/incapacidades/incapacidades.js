import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getIncapacidades } from '../../config/axios';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

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

const Incapacidades = () => {
    const [incapacidades, setIncapacidades] = useState([]);
    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {
        async function getAllIncapacidades() {
            let response = await getIncapacidades();
            let vacio = [];
            if (response.data === "") {
                setIncapacidades(vacio);
            } else {
                setIncapacidades(response.data);
            }

        };
        getAllIncapacidades();
    }, []);

    return (
        <div className={classes.container}>
            <Button variant="outlined" onClick={() => history.push("/crearIncapacidad")}>Ingresar Incapacidad</Button>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow className={classes.thead}>
                        <TableCell>Numero Incapacidad</TableCell>
                        <TableCell>Empleado</TableCell>
                        <TableCell>Fecha Inicio</TableCell>
                        <TableCell>Fecha Fin</TableCell>
                        <TableCell>Nexos</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {incapacidades.map((obj) => (
                        <TableRow className={classes.row}>
                            <TableCell>{obj.numIncapacidad}</TableCell>
                            <TableCell>{obj.nombreCompleto}</TableCell>
                            <TableCell>{obj.fechaInicio}</TableCell>
                            <TableCell>{obj.fechaFin}</TableCell>
                            <TableCell>
                                <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/nexosPorIncapacidad/${obj.idIncapacidad}`}>Ir</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Incapacidades;