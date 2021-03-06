import React, { useContext, useState } from 'react';
import { FormGroup, FormControl, Button, makeStyles, Typography, OutlinedInput, InputAdornment, IconButton, InputLabel } from '@material-ui/core';
import TextField from '@mui/material/TextField';
import { editPassword } from '../../config/axios';
import toast, { Toaster } from 'react-hot-toast';
import UserLoginContext from '../../context/login/UserLoginContext';
import decrypt from '../../utils/decrypt';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { ThemeProvider } from '@mui/material/styles';
import Theme from '../../config/ThemeConfig';
import Template from '../Template'

const initialValue = {
    idUsuario: '',
    oldPassword: '',
    newPassword: '',
    confirmar: ''
}

const useStyles = makeStyles({
    container: {
        width: '50%',
        margin: '5% 0 0 15%',
        '& > *': {
            marginTop: 20
        }
    }
})

const Perfil = () => {
    const [perfil, setPerfil] = useState(initialValue);
    const { oldPassword, newPassword, confirmar } = perfil;

    const [actionOldPass, setActionOldPass] = useState(false)
    const [actionNewPass, setActionNewPass] = useState(false)
    const [actionConfirmar, setActionConfirmar] = useState(false)

    const classes = useStyles();


    //datos guardados en Localstorage
    const userStateEncrypt = useContext(UserLoginContext);
    const userStore = JSON.parse(decrypt(userStateEncrypt.userLogin));

    const onValueChange = (e) => {
        setPerfil({ ...perfil, [e.target.name]: e.target.value })
    }

    const cancelChange = async () => {
        setPerfil(initialValue);
        setActionOldPass(false);
        setActionNewPass(false);
        setActionConfirmar(false);

    }


    const handleClickShowOldPassword = () => {
        if (actionOldPass === false) {
            setActionOldPass(true);
        } else {
            setActionOldPass(false)
        }
    };

    const handleClickShowNewPassword = () => {
        if (actionNewPass === false) {
            setActionNewPass(true);
        } else {
            setActionNewPass(false)
        }
    };

    const handleClickShowConfPassword = () => {
        if (actionConfirmar === false) {
            setActionConfirmar(true);
        } else {
            setActionConfirmar(false)
        }
    };

    const changePassword = async () => {
        if (oldPassword.trim() === "") {
            toast.error("Campo Requerido! Ingrese contrase??a actual");
        } else if (newPassword.trim() === "") {
            toast.error("Campo requerido! Ingrese nueva contrase??a");
        } else if (perfil.oldPassword === perfil.newPassword) {
            toast.error("La contrase??a nueva no puede ser igual a la anterior");
        }
        else {

            if (perfil.newPassword !== perfil.confirmar) {
                toast.error("La contrase??a nueva no es igual a la confirmacion");
            } else {
                delete perfil.confirmar;
            }
            perfil.idUsuario = userStore.idUsuario;

            try {
                const result = await editPassword(perfil);
                if (result.data === 'fields affected') {
                    toast.success('Contrase??a Actualizada');
                }
            } catch (error) {
                if (error.request.response !== '') {
                    var notificacion = error.request.response.split(":");
                    notificacion = notificacion[1].split("}");
                    toast.error(notificacion[0]);
                } else {
                    toast.error("ERROR NETWORK, no se obtuvo respuesta con el servidor");
                }
            }

        }
    };

    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <FormGroup className={classes.container}>
                <div><Toaster /></div>
                <Typography align="center" variant="h4">Cambiar Contrase??a</Typography>
                <FormControl>
                    <TextField
                        label="Nombre Completo"
                        variant="outlined"
                        defaultValue={userStore.nombreCompleto}
                        InputProps={{ readOnly: true }}
                    />
                </FormControl>
                <FormControl>
                    <TextField
                        label="Correo Electronico"
                        variant="outlined"
                        defaultValue={userStore.correo}
                        InputProps={{ readOnly: true }}
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Ingrese Contrase??a Actual</InputLabel>
                    <OutlinedInput
                        type={actionOldPass ? 'text' : 'password'}
                        name="oldPassword"
                        value={oldPassword}
                        inputProps={{ maxLength: 12 }}
                        onChange={(e) => onValueChange(e)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowOldPassword}>
                                    {actionOldPass ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Ingrese Contrase??a Actual"
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Ingrese Nueva Contrase??a</InputLabel>
                    <OutlinedInput
                        type={actionNewPass ? 'text' : 'password'}
                        name="newPassword"
                        value={newPassword}
                        inputProps={{ maxLength: 12 }}
                        onChange={(e) => onValueChange(e)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowNewPassword}>
                                    {actionNewPass ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Ingrese Nueva Contrase??a"
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
                    <InputLabel htmlFor="outlined-adornment-password">Confirme Contrase??a</InputLabel>
                    <OutlinedInput
                        type={actionConfirmar ? 'text' : 'password'}
                        name="confirmar"
                        value={confirmar}
                        inputProps={{ maxLength: 12 }}
                        onChange={(e) => onValueChange(e)}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton onClick={handleClickShowConfPassword}>
                                    {actionConfirmar ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        }
                        label="Confirme Contrase??a"
                    />
                </FormControl>
                <FormControl>
                    <Button variant="contained" color="primary" onClick={() => changePassword()}>Cambiar Contrase??a</Button>
                    <Button variant="contained" color="secondary" onClick={() => cancelChange()} style={{ marginTop: 10 }}>Cancelar</Button>
                </FormControl>
            </FormGroup>
        </ThemeProvider>
    );
}

export default Perfil;