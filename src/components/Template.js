import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link } from "react-router-dom";
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import UserLoginContext from '../context/login/UserLoginContext';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import decrypt from '../utils/decrypt';
import './template.css';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

function Container() {
  //abrir o cerrar menu
  const [open, setOpen] = useState(false);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  //dato de usuario logeado
  const userStateEncrypt = useContext(UserLoginContext);
  const userState = JSON.parse(decrypt(userStateEncrypt.userLogin));

  const mdTheme = createTheme();

  const drawerWidth = 240;

  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));

  const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      '& .MuiDrawer-paper': {
        position: 'relative',
        whiteSpace: 'nowrap',
        width: drawerWidth,
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: 'border-box',
        ...(!open && {
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          width: theme.spacing(7),
          [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9),
          },
        }),
      },
    }),
  );

  const itemsList = [
    {
      text: "Solicitudes",
      icon: <DocumentScannerOutlinedIcon />,
      path: "/solicitudes"
    },
    {
      text: "Oficinas",
      icon: <HomeWorkOutlinedIcon />,
      path: "/oficinas"
    },
    {
      text: "Empresas",
      icon: <LocationCityOutlinedIcon />,
      path: "/empresas"
    },
    {
      text: "Personas",
      icon: <GroupOutlinedIcon />,
      path: "/personas"
    },
    {
      text: "Incapacidades",
      icon: <HealthAndSafetyOutlinedIcon />,
      path: "/incapacidades"
    },
    {
      text: "Reportes",
      icon: <AssessmentOutlinedIcon />,
      path: "/Reportes"
    }
  ];

  const mostrarMenu = () => {
    var listar;

    if (userState.idRol !== 1) {
      listar = (
        <List>
          <Link to={"/solicitudes"}>
            <ListItem button key="Solicitudes">
              <ListItemIcon>
                <DocumentScannerOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Solicitudes" />
            </ListItem>
          </Link>
        </List>
      )
    } else {
      listar = (
        <List>
          {itemsList.map((item, index) => {
            const { text, icon, path } = item;
            return (
              <Link to={path}>
                <ListItem button key={text}>
                  {icon && <ListItemIcon>{icon}</ListItemIcon>}
                  <ListItemText primary={text} />
                </ListItem>
              </Link>
            );
          })}
        </List>
      )
    }

    return listar;
  }

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <Link to={"/"}>
          <ListItem button key="Cerrar Sesion">
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Cerrar Sesion" />
          </ListItem>
        </Link>
        <Link to={"/perfil"}>
          <ListItem button key="Cambiar Contraseña">
            <ListItemIcon>
              <PersonOutlineOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Cambiar Contraseña" />
          </ListItem>
        </Link>
      </List>
      {mostrarMenu()}
    </div>
  );

  return (
    <ThemeProvider theme={mdTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar sx={{ pr: '24px', }}>
            <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={toggleDrawer}
              sx={{
                marginRight: '36px', //boton de menu
                ...(open && { display: 'none' }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="h1" sx={{ flexGrow: 1 }}>
              Bienvenido {userState.nombreCompleto}
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          {drawer}
          <Toolbar sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            px: [1],
          }}
          >
            <IconButton onClick={toggleDrawer}> <ChevronLeftIcon /> </IconButton>
          </Toolbar>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
        </Box>
      </Box>
    </ThemeProvider>
  );
}

Container.propTypes = {

  window: PropTypes.func,
};

export default Container;