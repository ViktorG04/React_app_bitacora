import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getPersonas, updateEstadoPersona } from '../config/axios';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Link } from 'react-router-dom';
import { useHistory } from "react-router-dom";

const useStyles = makeStyles({
    container:{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '60px'
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

const Personas = () => {
    const [personas, setPersonas] = useState([]);

    const classes = useStyles();
    const history = useHistory();


    useEffect(() => {
        async function getAllPersonas() {
            const response = await getPersonas();

            var data = response.data;

            for (const i in data) {
                var action;
                if (data[i]['estado'] !== 'Activo') {
                    action = false;
                } else {
                    action = true;
                }
                data[i].action = action;
            }
            setPersonas(response.data);
        };
        getAllPersonas();

    }, []);


    const handleChange = async(event) => {
        console.log(event.target.name+"  "+event.target.checked);

       var idEstado = '';
       if(event.target.checked === true){
            idEstado= 1;
       }else{
           idEstado = 2;
       }
        let estado ={
            id: event.target.name,
            estado: idEstado
        };
       try {
            await updateEstadoPersona(estado);
            alert('Estado Actualizado');
            window.location.reload(false);
  
        } catch (error) {
            var notificacion = error.request.response.split(":");
            notificacion = notificacion[1].split("}");
            alert(notificacion[0]);
        } 
      };

    return (
        <div className={classes.container}>
        <Button variant="outlined" onClick={() => history.push("/crearEmpleado") }>Crear Empleado</Button>
        <Table className={classes.table}>
            <TableHead>
                <TableRow className={classes.thead}>
                    <TableCell>Nombre y Apellido</TableCell>
                    <TableCell>Documento Identidad</TableCell>
                    <TableCell>Empresa</TableCell>
                    <TableCell>Actualizar Datos</TableCell>
                    <TableCell>Estado</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {personas.map((per) => (
                    <TableRow className={classes.row}>
                        <TableCell>{per.nombreCompleto}</TableCell>
                        <TableCell>{per.docIdentidad}</TableCell>
                        <TableCell>{per.empresa}</TableCell>
                        <TableCell>
                            <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/editarPersona/${per.idPersona}`} disabled={!per.action}>Editar</Button>
                        </TableCell>
                        <TableCell>
                        <FormControlLabel control={<Switch checked={per.action} onChange={handleChange} name={per.idPersona}/>} label={per.estado} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
}

export default Personas;