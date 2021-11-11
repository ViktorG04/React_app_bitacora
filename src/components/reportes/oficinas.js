import React, { useState, useEffect, useContext } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import DataReportesContext from '../../context/ReporteContext';
import decrypt from '../../utils/decrypt';

const useStyles = makeStyles({
    table: {
        width: '100%',
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
            fontSize: 18,
        }
    }
})


const VisitasOficina = () => {
    const [visitas, setVisitas] = useState([]);
    const classes = useStyles();

    //data reporte
    const reporteStateEncrypt = useContext(DataReportesContext);
    const dataOficinas = JSON.parse(decrypt(reporteStateEncrypt.reportes));

    useEffect(() => {
        setVisitas(dataOficinas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <section VisibilityOff>
        <Table className={classes.table}>
        <TableHead>
            <TableRow className={classes.thead}>
                <TableCell>Oficina</TableCell>
                <TableCell>Capacidad</TableCell>
                <TableCell>Personas Aprobadas</TableCell>
                <TableCell>Personas En Sitio</TableCell>
                <TableCell>Personas ya Salieron</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            {visitas.map((obj) => (
                <TableRow className={classes.row}>
                    <TableCell>{obj.descripcion}</TableCell>
                    <TableCell align="center">{obj.capacidad}</TableCell>
                    <TableCell align="center">{obj.Personas_SolicitudAprobada}</TableCell>
                    <TableCell align="center">{obj.Personas_en_sitio}</TableCell>
                    <TableCell align="center">{obj.Personas_ya_salieron}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </section>
    );
}

export default VisitasOficina;