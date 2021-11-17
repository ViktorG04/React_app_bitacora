import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles, TextField } from '@material-ui/core'
import { getIncapacidades, getPersonasPorEmpresa, incapacidadByEmpleado } from '../../config/axios';
import Button from '@mui/material/Button';
import { useHistory } from "react-router-dom";
import { Autocomplete, Stack } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';

const useStyles = makeStyles({
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        margin: '5% 0 0 15%',
        '& > *': {
            marginTop: '0px'
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

const Incapacidades = () => {
    const [incapacidades, setIncapacidades] = useState([]);

    //manejar autocomple
    const [empleados, setEmpleados] = useState([]);
    const [empleado, setValue] = useState('');

    //name button
    const [nameButton, setNameButton] = useState("BUSCAR");

    //button color
    const [colorButton, setColorButton] = useState("primary");

    //editable oficina
    const [stateEditable, setStateEditable] = useState(false);

    const classes = useStyles();
    const history = useHistory();

    useEffect(() => {

        getAllIncapacidades();

        async function getAllEmpleados() {
            const response = await getPersonasPorEmpresa(1);
            setEmpleados(response.data);
        };
        getAllEmpleados()
    }, []);

    async function getAllIncapacidades() {
        let response = await getIncapacidades();
        let vacio = [];
        if (response.data === "") {
            setIncapacidades(vacio);
            toast.error("ERROR NETWORK, no se obtuvo respuesta con el servidor");
        } else {
            setIncapacidades(response.data);
        }

    };

    const buscarPorEmpleado = async () => {
        if (nameButton === "BUSCAR") {
            if (empleado !== null) {
                var result = await incapacidadByEmpleado(empleado['idPersona'])
                setIncapacidades(result.data);
                setNameButton("LIMPIAR");
                setColorButton("secondary")
                setStateEditable(true);
            }else{
                toast.error('escriba o busque un empleado')
            }
        } else {
            setNameButton("BUSCAR");
            setColorButton("primary")
            setStateEditable(false);
            setValue('');
            getAllIncapacidades();
        }
    };

    const accionIr = async (id) => {
        window.open(`/nexosPorIncapacidad/${id}`);
    };

    return (
        <div className={classes.container}>
            <div><Toaster /></div>
            <Stack spacing={4} direction="row">
                <Autocomplete
                    sx={{ width: 300 }}
                    disabled={stateEditable}
                    onChange={(event, newValue) => {
                        setValue(newValue);
                    }}
                    options={empleados}
                    getOptionLabel={(option) => option.nombreCompleto}
                    renderInput={(params) => <TextField {...params} label="Buscar Empleado" />}
                />
                <Button variant="outlined" color={colorButton} onClick={() => buscarPorEmpleado()}>{nameButton}</Button>

                <Button variant="outlined" onClick={() => history.push("/crearIncapacidad")}
                    style={{ marginLeft: "auto" }}>INGRESAR INCAPACIDAD</Button>
            </Stack>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow className={classes.thead}>
                        <TableCell>Incapacidad</TableCell>
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
                                <Button color="primary" variant='inherit' onClick={() => accionIr(obj.idIncapacidad)}>Ir</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}

export default Incapacidades;