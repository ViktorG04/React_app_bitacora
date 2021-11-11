import React, { useState, useEffect, useContext } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import ReportesContext from '../../context/ReporteContext';
import decrypt from '../../utils/decrypt';

const useStyles = makeStyles({
    table: {
        width: '98%',
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

    //data reporte
    const reporteStateEncrypt = useContext(ReportesContext);
    const dataVisitas = JSON.parse(decrypt(reporteStateEncrypt.reportes));

    useEffect(() => {
            let vacio = [];
            if (dataVisitas === "") {
                setVisitas(vacio);
            } else {
                for (const i in dataVisitas) {
                    if (dataVisitas[i]['idEstado'] === 7) {
                        dataVisitas[i]['idEstado'] = 'Ingreso'
                    } else if (dataVisitas[i]['idEstado'] === 6) {
                        dataVisitas[i]['idEstado'] = 'Ingreso'
                    } else {
                        dataVisitas[i]['idEstado'] = 'No ingreso'
                    }
                }
                setVisitas(dataVisitas);
            }
            
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
                        <TableCell align="center">{obj.idSolicitud}</TableCell>
                        <TableCell>{obj.nombreCompleto}</TableCell>
                        <TableCell>{obj.docIdentidad}</TableCell>
                        <TableCell>{obj.empresa}</TableCell>
                        <TableCell>{obj.oficina}</TableCell>
                        <TableCell>{obj.fechaHoraIngreso}</TableCell>
                        <TableCell>{obj.fechaHoraSalida}</TableCell>
                        <TableCell align="center">{obj.temperatura}</TableCell>
                        <TableCell>{obj.idEstado}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </section>
    );
}

export default Visitas;