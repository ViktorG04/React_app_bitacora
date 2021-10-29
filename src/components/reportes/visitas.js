import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getVisitas } from '../../config/axios';

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

const Visitas = () => {
    const [visitas, setVisitas] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        async function getAllVisitas() {
            let response = await getVisitas();
            let vacio = [];
            if (response.data === "") {
                setVisitas(vacio);
            } else {
                for (const i in response.data) {
                    if (response.data[i]['idEstado'] === 7) {
                        response.data[i]['idEstado'] = 'ingreso'
                    } else if (response.data[i]['idEstado'] === 6) {
                        response.data[i]['idEstado'] = 'Adentro'
                    } else {
                        response.data[i]['idEstado'] = 'No ingreso'
                    }
                }

                setVisitas(response.data);
            }

        };
        getAllVisitas();
    }, []);

    return (
        <section VisibilityOff>
            <Table className={classes.table}>
            <TableHead>
                <TableRow className={classes.thead}>
                    <TableCell>solicitud</TableCell>
                    <TableCell>Nombre Completo</TableCell>
                    <TableCell>Documento Identidad</TableCell>
                    <TableCell>Empresa</TableCell>
                    <TableCell>Oficina</TableCell>
                    <TableCell>Fecha y Hora Ingreso</TableCell>
                    <TableCell>Fecha y Hora Salida</TableCell>
                    <TableCell>Temperatura</TableCell>
                    <TableCell>Estado</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {visitas.map((obj) => (
                    <TableRow className={classes.row}>
                        <TableCell>{obj.idSolicitud}</TableCell>
                        <TableCell>{obj.nombreCompleto}</TableCell>
                        <TableCell>{obj.docIdentidad}</TableCell>
                        <TableCell>{obj.empresa}</TableCell>
                        <TableCell>{obj.oficina}</TableCell>
                        <TableCell>{obj.fechaHoraIngreso}</TableCell>
                        <TableCell>{obj.fechaHoraSalida}</TableCell>
                        <TableCell>{obj.temperatura}</TableCell>
                        <TableCell>{obj.idEstado}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </section>
    );
}

export default Visitas;