import React, { useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useHistory } from 'react-router';
import { getLogin } from '../config/axios';
import toast, { Toaster } from 'react-hot-toast';
import UserLoginContext from '../context/login/UserLoginContext';
import encrypt from '../utils/encrypt';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://www.GatorWork.com.sv">
        GatorWork S.A de C.V
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

  // Acceder al context
  const userState = useContext(UserLoginContext);

  //Extraer el usuario
  const { correo, password } = user;


  const onChange = e => {
    saveUser({
      ...user,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    //Validar campos vacios
    if (correo.trim() === "") {
      toast.error("Ingrese su correo");

    } else if (password.trim() === "") {
      toast.error("Ingrese su password");
    } else {

      try {
        const user = await getLogin({ correo, password });
        userState.setUserLogin(encrypt(JSON.stringify(user.data)));
        history.push("/solicitudes");

      } catch (error) {

        var notificacion = error.request.response.split(":");
        notificacion = notificacion[1].split("}");
        toast.error(notificacion[0]);
      }

      /*
        1. mandar por post al back
        2. valida si es corecto
        (antes) configurar context, y provider
        3. guardarlo en el context
        4. guardarlo en el localStorage
        5. usar hook useStorage para rehidratar el context, por si el usuario presiona f5
        6. react rbac, o privateRoutes
      */
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <div><Toaster /></div>
      <CssBaseline />
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
        </Avatar>
        <Typography component="h1" variant="h5"> Login</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField margin="normal" required fullWidth id="correo" type="email" label="Email" name="correo" autoComplete="email"
            autoFocus onChange={onChange} value={correo} />
          <TextField margin="normal" required fullWidth name="password" label="Password" type="password" id="password" autoComplete="current-password"
            onChange={onChange} value={password} />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>Ingresar </Button>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}