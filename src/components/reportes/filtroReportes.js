import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles, FormGroup, Typography, FormControl, TextField, MenuItem } from '@material-ui/core'
import { getOficinas, getVisitas } from '../../config/axios';
import { DateTimePicker, DesktopDatePicker, LocalizationProvider } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import { Stack } from '@mui/material';
import { Box } from '@mui/system';

const useStyles = makeStyles({
    container: {
        width: '50%',
        margin: '6% 0 0 4%',
        '& > *': {
            marginTop: '8px'
        }
    }
})

const FiltroReportes = () => {

    const [value, setValue] = useState(new Date());
    const [areas, setAreas] = useState([]);

    const classes = useStyles();

    useEffect(() => {
        async function getAllOficinas() {
            const response = await getOficinas();
            for (const i in response.data) {
                if (response.data[i]['idEstado'] === 2) {
                    delete response.data[i]
                }
            }
            setAreas(response.data);
        };
        getAllOficinas();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (newValue) => {
        setValue(newValue);
    };

    return (
        <FormGroup className={classes.container}>
            <Typography align="center" variant="h4">Filtro Reportes</Typography>
            <Box
                component="form"
                sx={{ '& > :not(style)': { m: 1, width: '45%' }, }}
                noValidate
                autoComplete="off"
            >
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    value={value}
                    label="FECHA INICIO"
                    autoFocus
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DesktopDatePicker
                    value={value}
                    label="FECHA FIN"
                    autoFocus
                    onChange={handleChange}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>


            <TextField
                    select
                    label="OFICINA"
                    name="idArea" id="idArea" required>
                    {areas?.map(option => {
                        return (<MenuItem value={option.idArea}> {option.descripcion} </MenuItem>);
                    })}
                </TextField>
            </Box>
            <Table>
                <TableBody>
                    <TableCell aling="right">
                        Visitas
                    </TableCell>
                    <TableCell><b>generar</b></TableCell>
                    <TableCell aling="right">
                        Capacidad
                    </TableCell>
                    <TableCell><b>generar</b></TableCell>

                </TableBody>
            </Table>

        </FormGroup>
    );
}

export default FiltroReportes;