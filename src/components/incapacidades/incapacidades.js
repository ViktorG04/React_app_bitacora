import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles, TextField } from '@material-ui/core'
import { getEmpleados, getIncapacidades, incapacidadByEmpleado } from '../../config/axios';
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";
import { Autocomplete, Stack } from '@mui/material';


const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '80px'
    },
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

const Incapacidades = () => {
    const [incapacidades, setIncapacidades] = useState([]);

     //manejar autocomple
     const [empleados, setEmpleados] = useState([]);
     const [empleado, setValue] = useState(0);

    //name button
    const [nameButton, setNameButton] = useState("BUSCAR");

    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {

        getAllIncapacidades();

        async function getAllEmpleados() {
            const response = await getEmpleados();
            setEmpleados(response.data);
        };
        getAllEmpleados()
    }, []);

    async function getAllIncapacidades() {
        let response = await getIncapacidades();
        let vacio = [];
        if (response.data === "") {
            setIncapacidades(vacio);
        } else {
            setIncapacidades(response.data);
        }

    };

    const buscarPorEmpleado = async () => {

        if (nameButton === "BUSCAR" && empleado !== null) {
            var result = await incapacidadByEmpleado(empleado['idEmpleado'])

            setIncapacidades(result.data);
            setNameButton("LIMPIAR");
        } else {
            setNameButton("BUSCAR");
            setValue(null);
            getAllIncapacidades();
        }
    };

    const accionIr = async (id) =>{
        window.open(`/nexosPorIncapacidad/${id}`);
    };

    return (
        <div className={classes.container}>
            <Stack spacing={4} direction="row">
                <Autocomplete
                    sx={{ width: 300 }}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    options={empleados}
                    getOptionLabel={(option) => option.nombreCompleto}
                    renderInput={(params) => <TextField {...params} label="Buscar Empleado" />}
                />
                <Button variant="contained" onClick={() => buscarPorEmpleado()}>{nameButton}</Button>

                <Button variant="contained" color="success" onClick={() => history.push("/crearIncapacidad")}
                    style={{ marginLeft: "auto" }}>INGRESAR INCAPACIDAD</Button>
            </Stack>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow className={classes.thead}>
                        <TableCell>Numero Incapacidad</TableCell>
                        <TableCell>Empleado</TableCell>
                        <TableCell>Fecha Inicio</TableCell>
                        <TableCell>Fecha Fin</TableCell>
                        <TableCell>Nexos</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {incapacidades.map((obj) => (
                        <TableRow className={classes.row}>
                            <TableCell>{obj.numIncapacidad}</TableCell>
                            <TableCell>{obj.nombreCompleto}</TableCell>
                            <TableCell>{obj.fechaInicio}</TableCell>
                            <TableCell>{obj.fechaFin}</TableCell>
                            <TableCell>
                                <Button color="primary" variant='inherit' style={{ marginRight: 10 }} onClick={() =>accionIr(obj.idIncapacidad)}>Ir</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Incapacidades;


//`/nexosPorIncapacidad/${obj.idIncapacidad}`