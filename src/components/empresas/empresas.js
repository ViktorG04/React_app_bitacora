import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getEmpresas } from '../../config/axios';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'
import { Box } from '@mui/system';
import toast, { Toaster } from 'react-hot-toast';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '5% 0 0 18%',
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

const Empresas = () => {
    const [empresas, setEmpresas] = useState([]);
    const classes = useStyles();


    useEffect(() => {
        getAllEmpresas();
    }, []);

    const getAllEmpresas = async () => {
        const response = await getEmpresas();
        let array = [];
        let estado = "";
        if (response.data === "") {
            setEmpresas(array);
            toast.error("ERROR NETWORK, no se obtuvo respuesta con el servidor");
        } else {
            array = response.data;
            for (const i in array) {
                if (array[i]['idEstado'] !== 1) {
                    estado = "Inactivo";
                } else {
                    estado = "Activo"
                }
                array[i].estado = estado;
                delete array[i]['idEstado'];
            }
            setEmpresas(array);
        }
    }
    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <Box className={classes.container}>
                <div><Toaster /></div>
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
                                    <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/editarEmpresa/${emp.idEmpresa}`}>Editar</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Box>
        </ThemeProvider>
    );
}

export default Empresas;