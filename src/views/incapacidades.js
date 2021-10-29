import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getIncapacidades } from '../config/axios';
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

const Incapacidades = () => {
    const [incapacidades, setIncapacidades] = useState([]);
    const classes = useStyles();

    useEffect(() => {
       async function getAllIncapacidades(){
        let response = await getIncapacidades();
        let vacio = [];
        if(response.data === ""){
            setIncapacidades(vacio);
        }else{
            setIncapacidades(response.data);
        }
       
       };
       getAllIncapacidades();
    }, []);
    
    return (
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
    );
}   
 
export default Incapacidades;