import React, { useState, useEffect, useContext } from 'react';
import { makeStyles, Typography, TextField, MenuItem, Grid, Paper, Button, Divider } from '@material-ui/core'
import { getOficinas, getVisitas, getVisitasOficina, getVisitasByDate, getVisitasByOficina, getVisitasByOficinaAndDate } from '../../config/axios';
import { DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'
import { styled } from '@mui/material/styles';
import encrypt from '../../utils/encrypt';
import ReportesContext from '../../context/ReporteContext';
import toast, { Toaster } from 'react-hot-toast';


const useStyles = makeStyles({
    container: {
        width: '100%',
        margin: '6% 0 0 4%',
        '& > *': {
            marginTop: '10px'
        }
    }
})

const FiltroReportes = () => {

    const [areas, setAreas] = useState([]);
    const [idArea, setIdArea] = useState(0);

    //name button oficinas
    const [nameButton, setNameButton] = useState("GENERAR REPORTE");

    //color boton oficinas
    const [colorOfi, setColorOfi] = useState("primary")

    //accion fecha oficinas
    const [fechaI, setValueFI] = useState(new Date());

    //editable oficina
    const [stateOficina, setStateOficina] = useState(false);


    //name button visitas
    const [nameButtonV, setNameButtonV] = useState("GENERAR REPORTE");

    //color boton visitas
    const [colorVi, setColorVi] = useState("primary");

    //accion fecha visitas
    const [fechaVI, setValueFVI] = useState(null);
    const [fechaVF, setValueFVF] = useState(null);

    //editable oficina
    const [stateVisitas, setStateVisitas] = useState(false);


    // Acceder al context
    const reportes = useContext(ReportesContext);

    const classes = useStyles();

    const Item = styled(Paper)(({ theme }) => ({
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    useEffect(() => {
        async function getAllOficinas() {

            var oficinas = [{ idArea: 0, descripcion: "todas las areas" }]
            const response = await getOficinas();
            for (const i in response.data) {
                if (response.data[i]['idEstado'] === 2) {
                    delete response.data[i]
                }
                oficinas.push(response.data[i]);
            }
            var allOficinas = oficinas.filter(function (e) { return e != null; });
            setAreas(allOficinas);
        };
        getAllOficinas();
    }, []);

    const handleChange = (event) => {
        setIdArea(event.target.value);
    };

    const reporteOficinas = async () => {
        var fecha = fechaI.toISOString().substr(0, 10);

        if (nameButton === "GENERAR REPORTE") {
            toast.success("generando reporte")
            const result = await getVisitasOficina({ fecha });
            reportes.setReportes(encrypt(JSON.stringify(result.data)));

            setNameButton("LIMPIAR");
            setColorOfi("secondary");
            setStateOficina(true);
            setTimeout(() => {
                window.open("/reportes/oficinas");
            }, 2000);

        } else {
            setNameButton("GENERAR REPORTE");
            setColorOfi("primary")
            setStateOficina(false);
            setValueFI(new Date());

        }
    };

    const reporteVisitas = async () => {
        var fechaI, fechaF;
        if (nameButtonV !== "GENERAR REPORTE") {
            limpiar();
        } else {
            if (fechaVF !== null && fechaVI !== null && idArea !== 0) {
                fechaI = fechaVI.toISOString().substr(0, 10);
                fechaF = fechaVF.toISOString().substr(0, 10);
                if (fechaI > fechaF) {
                    toast.error("La fecha fin no puede ser mayor a la fecha inicio")
                } else {
                    toast.success("reporte de una oficina entre un rango de fechas")
                    const response = await getVisitasByOficinaAndDate({ fechaI, fechaF, idArea });
                    reportes.setReportes(encrypt(JSON.stringify(response.data)));
                    setTimeout(() => {
                        window.open("/reportes/visitas");
                    }, 2000);
                }
            } else if (fechaVF !== null && fechaVI !== null && idArea === 0) {
                fechaI = fechaVI.toISOString().substr(0, 10);
                fechaF = fechaVF.toISOString().substr(0, 10);
                if (fechaI > fechaF) {
                    toast.error("La fecha fin no puede ser mayor a la fecha inicio")
                } else {
                    toast.success("reporte de todas las oficina entre un rango de fechas")
                    const response = await getVisitasByDate({ fechaI, fechaF });
                    reportes.setReportes(encrypt(JSON.stringify(response.data)));
                    setTimeout(() => {
                        window.open("/reportes/visitas");
                    }, 2000);
                }

            } else if (fechaVI !== null && fechaVF === null) {
                toast.error("seleccione una fecha fin")
            } else if (fechaVI === null && fechaVF !== null) {
                toast.error("seleccione una fecha inicio")
            } else if (fechaVF === null && fechaVI === null && idArea !== 0) {
                toast.success("reporte general de una oficina");
                const response = await getVisitasByOficina(idArea);
                reportes.setReportes(encrypt(JSON.stringify(response.data)));
                setTimeout(() => {
                    window.open("/reportes/visitas");
                }, 2000);
            } else {
                toast.success("reporte general sin filtros");
                const response = await getVisitas();
                reportes.setReportes(encrypt(JSON.stringify(response.data)));
                setTimeout(() => {
                    window.open("/reportes/visitas");
                }, 2000);
            }
            setNameButtonV("LIMPIAR");
            setColorVi("secondary");
            setStateVisitas(true);
        }

    };

    const limpiar = async () => {
        setNameButtonV("GENERAR REPORTE");
        setColorVi("primary");
        setStateVisitas(false);
        setValueFVI(null);
        setValueFVF(null);
        setIdArea(0);
    };

    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <Box className={classes.container}>
                <div><Toaster /></div>
                <Typography align="center" variant="h4">Reportes</Typography>
                <Grid item xs={10} align="center">
                    <Item>
                        <Typography variant="h6">CAPACIDAD OFICINAS</Typography>
                        <Stack direction="row"
                            justifyContent="center"
                            alignItems="baseline"
                            divider={<Divider orientation="vertical" flexItem />}
                            spacing={8}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    value={fechaI}
                                    label="Buscar por Fecha"
                                    inputFormat = "dd-MM-yyyy"
                                    autoFocus
                                    disabled={stateOficina}
                                    minDate={new Date('2021-10-01')}
                                    onChange={(newValue) => {
                                        setValueFI(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <Button variant="outlined" color={colorOfi} onClick={() => reporteOficinas()} style={{ marginTop: 10 }}>{nameButton}</Button>
                        </Stack>
                    </Item>
                </Grid>
                <Grid item xs={10} style={{ align: "center", marginTop: 20 }}>
                    <Item>
                        <Typography variant="h6">REPORTE DE VISITAS</Typography>
                        <Stack direction="row"
                            justifyContent="center"
                            alignItems="baseline"
                            divider={<Divider orientation="vertical" flexItem />}
                            spacing={4}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DesktopDatePicker
                                    value={fechaVI}
                                    label="Fecha Inicio"
                                    inputFormat = "dd-MM-yyyy"
                                    autoFocus
                                    disabled={stateVisitas}
                                    minDate={new Date('2021-10-01')}
                                    onChange={(newValue) => {
                                        setValueFVI(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                                <DesktopDatePicker
                                    value={fechaVF}
                                    label="Fecha Fin"
                                    inputFormat = "dd-MM-yyyy"
                                    autoFocus
                                    disabled={stateVisitas}
                                    minDate={new Date('2021-10-01')}
                                    onChange={(newValue) => {
                                        setValueFVF(newValue);
                                    }}
                                    renderInput={(params) => <TextField {...params} />}
                                />
                            </LocalizationProvider>
                            <TextField
                                select
                                disabled={stateVisitas}
                                label="Oficinas"
                                sx={{ width: '50ch' }}
                                placeholder="Please enter text"
                                onChange={(e) => handleChange(e)} name="idArea" value={idArea} id="idArea">
                                {areas?.map(option => {
                                    return (<MenuItem value={option.idArea}> {option.descripcion} </MenuItem>);
                                })}
                            </TextField>
                            <Button variant="outlined" color={colorVi} onClick={() => reporteVisitas()} style={{ marginTop: 10 }}>{nameButtonV}</Button>
                        </Stack>
                    </Item>
                </Grid>
            </Box>
        </ThemeProvider>
    );
}

export default FiltroReportes;