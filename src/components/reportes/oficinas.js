import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getVisitasOficina } from '../../config/axios';

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

const VisitasOficina = () => {
    const [visitas, setVisitas] = useState([]);
    const classes = useStyles();

    var curr = new Date();
    curr.setDate(curr.getDate());
    var fecha = curr.toISOString().substr(0, 10);

    useEffect(() => {
        async function getAllVisitas() {
          let  data ={fecha: fecha};
          console.log(data);
            let response = await getVisitasOficina(data);
            let vacio = [];
            if (response.data === "") {
                setVisitas(vacio);
            } else {
                setVisitas(response.data);
            }
        };
        getAllVisitas();
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
                    <TableCell>{obj.capacidad}</TableCell>
                    <TableCell>{obj.Personas_SolicitudAprobada}</TableCell>
                    <TableCell>{obj.Personas_en_sitio}</TableCell>
                    <TableCell>{obj.Personas_ya_salieron}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </section>
    );
}

export default VisitasOficina;