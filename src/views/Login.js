import React, { useState, useContext, useRef, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AuthContext from '../context/login/AuthContext';
import { useHistory } from 'react-router';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.tecoloco.com.sv">
        Tecoloco
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function SignIn() {

const history = useHistory();

//State para iniciar sesion
const [user, saveUser] = useState({
  correo: "",
  password: ""
})

//Extraer el usuario
const { correo, password } = user;

//Contexto
const { isAuthenticated, userRol, onLogin } = useContext(AuthContext);

const checkIfUserIsAuthRef = useRef();

const getId = useRef();
getId.current = localStorage.getItem("idRol");

//Validando si esta logeado
const checkifUserIsAuth = () =>{
  if (isAuthenticated){
    //history.push("/adminhome");
    /* if(getId === 1){
      history.push("/adminhome");
    } else if (userRol === 2){
      history.push("/employedhome");
    } else if (userRol === 3){
      history.push("/securityhome");
    } */
  } else  {
    history.push("/");
    console.log("No logeado");
  }
}

checkIfUserIsAuthRef.current = checkifUserIsAuth;

useEffect(() => {
  checkIfUserIsAuthRef?.current()?.catch(null);
}, []);

const onChange = e => {
  saveUser({
    ...user,
    [e.target.name] : e.target.value
  })
}

const handleSubmit = (event) => {
    event.preventDefault();

    //Validar campos vacios
    if(correo.trim() === ""){
      alert("Ingrese su correo AD");
    } else if(password.trim() === ""){
      alert("Ingrese su password");
    } else{
      history.push("/adminhome");
      //Pasarlo al action
      //onLogin(correo, password);
      console.log(userRol);
/*       if(userRol === 1){
        history.push("/adminhome");
      } else if (userRol === 2){
        history.push("/employedhome");
      } else if (userRol === 3){
        history.push("/securityhome");
      } */
    }
};

return (      
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            
          </Avatar>
          <Typography component="h1" variant="h5">
            Ingresar al sistema
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="correo"
              type="email"
              label="Email"
              name="correo"
              autoComplete="email"
              autoFocus
              onChange={onChange}
              value={correo}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              onChange={onChange}
              value={password}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Ingresar
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  );
}