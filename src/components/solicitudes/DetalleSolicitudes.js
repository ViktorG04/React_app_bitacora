import React, { useState, useEffect } from 'react';
import { FormGroup, FormControl, InputLabel, Input, Button, makeStyles, Typography } from '@material-ui/core';
import { buscarSolicitudes, editSolicitud } from '../../config/axios';
import { useHistory, useParams } from "react-router-dom";
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const initialValue = {
    nombreCompleto: '',
    fechaVisita: '',
    motivo: '',
    Area: ''
}

const useStyles = makeStyles({
    container: {
        width: '50%',
        margin: '5% 0 0 25%',
        '& > *': {
            marginTop: 20
        }
    }
})

const DetalleSolicitud = () => {
    const [solicitud, setSolicitud] = useState(initialValue);
    const { fechaVisita, motivo, Area, nombreCompleto } = solicitud;
    const { id } = useParams();
    const classes = useStyles();

    const history = useHistory();
    
    const loadSolicitudDetails =  async() => {
        const response = await buscarSolicitudes(id);
        console.log(response.data);
        setSolicitud(response.data);
    }

    const editSolicitudDetails = async() => {
        const response = await editSolicitud(solicitud);
        //history.push('/all');
    }

    useEffect(() => {
        loadSolicitudDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onValueChange = (e) => {
        //console.log(e.target.value);
        setSolicitud({...solicitud, [e.target.name]: e.target.value})
    }

    return (
        <FormGroup className={classes.container}>
             <div><Toaster /></div>
            <Typography variant="h4">Agregar solicitud</Typography>
            <FormControl>
                <InputLabel htmlFor="my-input">Nombre</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='nombreCompleto' value={nombreCompleto} id="my-input" />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Fecha y Hora visita</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='fechfechaVisitaayHoraVisita' value={fechaVisita} id="my-input" />
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">Motivo</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='motivo' value={motivo} id="my-input"/>
            </FormControl>
            <FormControl>
                <InputLabel htmlFor="my-input">idArea</InputLabel>
                <Input onChange={(e) => onValueChange(e)} name='Area' value={Area} id="my-input" />
            </FormControl>
            <FormControl>
                <Button variant="contained" color="primary" onClick={() => editSolicitudDetails()}>Editar usuario</Button>
                <Button variant="contained" color="secondary" style={{ marginTop: 10 }} component={Link} to={`../solicitudes`}>Cancelar</Button>
            </FormControl>
        </FormGroup>
    );
}
 
export default DetalleSolicitud;