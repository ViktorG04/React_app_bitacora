import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getEmpresas } from '../config/axios';
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

const Empresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const classes = useStyles();

    useEffect(() => {
        getAllEmpresas();
    }, []);

    const getAllEmpresas = async () => {
        let response = await getEmpresas();
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
        setEmpresas(array);
    }
    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow className={classes.thead}>
                    <TableCell>Empresa</TableCell>
                    <TableCell>Tipo</TableCell>
                    <TableCell>Estado</TableCell>
                    <TableCell>Accion</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {empresas.map((emp) => (
                    <TableRow className={classes.row}>
                        <TableCell>{emp.nombre}</TableCell>
                        <TableCell>{emp.tipo}</TableCell>
                        <TableCell>{emp.estado}</TableCell>
                        <TableCell>
                            <Button color="primary" variant="contained" style={{marginRight:10}} component={Link} to={`/editarEmpresa/${emp.idEmpresa}`}>Editar</Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}   
 
export default Empresas;