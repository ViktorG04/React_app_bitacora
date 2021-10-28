import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getOficinas } from '../config/axios';
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

const Oficinas = () => {
    const [oficinas, setOficinas] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        getAllOficinas();
    }, []);

    const getAllOficinas = async () => {
        let response = await getOficinas();
        let array = {};
        let estado = "";
        array = response.data;
        for(const i in array){
            if(array[i]['idEstado'] !==1){
                estado = "Inactivo";
            }else{
                estado = "Activo"
            }
            array[i].estado = estado;
            delete array[i]['idEstado'];
        }
        setOficinas(array);
    };
    
    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow className={classes.thead}>
                    <TableCell>Oficina</TableCell>
                    <TableCell>Capacidad</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Accion</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {oficinas.map((ofi) => (
                    <TableRow className={classes.row}>
                        <TableCell>{ofi.descripcion}</TableCell>
                        <TableCell>{ofi.capacidad}</TableCell>
                        <TableCell>{ofi.estado}</TableCell>
                        <TableCell>
                            <Button color="primary" variant="contained" style={{marginRight:10}} component={Link} to={`/editarOficina/${ofi.idArea}`}>Editar</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}   
 
export default Oficinas;