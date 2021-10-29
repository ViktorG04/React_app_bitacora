import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { buscarNexoxPorIncapacidad } from '../../config/axios';
import { useParams} from "react-router-dom";

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

const Nexos = () => {
    const [nexos, setNexos] = useState([]);
    const classes = useStyles();

    const { id } = useParams();

    useEffect(() => {
        async function getAllVisitas() {

            let response = await buscarNexoxPorIncapacidad(id);
            let vacio = [];
            if (response.data === "") {
                setNexos(vacio);
            } else {
                setNexos(response.data);
            }
        };
        getAllVisitas();
    }, []);

    return (
        <section VisibilityOff>
        <Table className={classes.table}>
        <TableHead>
            <TableRow className={classes.thead}>
                <TableCell>Nombre Completo</TableCell>
                <TableCell>Oficina</TableCell>
                <TableCell>Temperatura</TableCell>
                <TableCell>Fechas Contacto</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {nexos.map((obj) => (
                <TableRow className={classes.row}>
                    <TableCell>{obj.nombreCompleto}</TableCell>
                    <TableCell>{obj.area}</TableCell>
                    <TableCell>{obj.temperatura}</TableCell>
                    <TableCell>{obj.fecha}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </section>
    );
}

export default Nexos;