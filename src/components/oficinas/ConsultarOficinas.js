import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getOficinas } from '../../config/axios';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";
import toast, { Toaster } from 'react-hot-toast';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '5% 0 0 20%',
        '& > *': {
            marginTop: '10px'
        }
    },
    table: {
        width: '100%',
        margin: '20px 0px'
    },
    thead: {
        '& > *': {
            fontSize: 22,
            background: '#cccc',
            color: '#000000',
        },
        textAlign: 'center'
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
    const history = useHistory();

    useEffect(() => {
        getAllOficinas();
    }, []);

    const getAllOficinas = async () => {
        let array = [];

        const response = await getOficinas();

        if(response.data === ''){
            toast.error("ERROR NETWORK, no se obtuvo respuesta con el servidor");
            setOficinas(array);
        }else{
            array = response.data;

            let estado = "";
            for (const i in array) {
                if (array[i]['idEstado'] !== 1) {
                    estado = "Inactivo";
                } else {
                    estado = "Activo"
                }
                array[i].estado = estado;
                delete array[i]['idEstado'];
            }
            setOficinas(array);
        }
    };

    return (
        <div className={classes.container}>
            <div><Toaster /></div>
            <Button variant="outlined" onClick={() => history.push("/crearOficina")}>Crear oficina</Button>
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
                                <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/editarOficina/${ofi.idArea}`}>Editar</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Oficinas;