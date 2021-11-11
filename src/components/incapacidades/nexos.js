import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { buscarNexoxPorIncapacidad, getOficinas } from '../../config/axios';
import { useParams} from "react-router-dom";

const useStyles = makeStyles({
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

                const areas = await getOficinas();
                console.log(areas);
                for(const i in response.data){
                    for(const x in areas.data){
                        if(response.data[i]['Area'] === areas.data[x]['idArea']){
                            response.data[i]['Area'] = areas.data[x]['descripcion']; 
                        }
                    }
                }
                setNexos(response.data);
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
                    <TableCell>{obj.Area}</TableCell>
                    <TableCell align="center">{obj.temperatura}</TableCell>
                    <TableCell align="center">{obj.fecha}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
    </section>
    );
}

export default Nexos;