import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableCell, TableRow, TableBody, makeStyles } from '@material-ui/core'
import { getPersonas, updateEstadoPersona } from '../config/axios';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
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

const Personas = () => {


    const [personas, setPersonas] = useState([]);
    const classes = useStyles();


    const [state, setState] = useState([]);

    const handleChange = (event) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    useEffect(() => { getAllPersonas();  }, []);

    const updateStatePerson = async () => {
        console.log(state);
      //  const result = await updateEstadoPersona();
    }

    const getAllPersonas = async () => {
        let response = await getPersonas();
        setPersonas(response.data);

        var person = {};
        let data = [];

        for(const i in response.data){

            person.id = response.data[i]['idPersona']
            if(response.data[i]['estado'] !== 'Activo'){
                person.estado = 2;
            }else{
                person.estado = 1;
            }

            data.push(person);
        }

      setState(data);
        
    }
    return (

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
                            <Button color="primary" variant="contained" style={{ marginRight: 10 }} component={Link} to={`/editarPersona/${per.idPersona}`}>Editar</Button>
                        </TableCell>
                        <TableCell>
                        <Switch
                         checked={state}
                           onChange={handleChange}
                            inputProps={{ 'aria-label': 'controlled' }}
                            onClick={() => updateStatePerson()}
                            />{per.estado}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>


    );
}

export default Personas;