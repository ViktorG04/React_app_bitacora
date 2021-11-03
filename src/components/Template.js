import { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { Link} from "react-router-dom";
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import UserLoginContext from '../context/login/UserLoginContext';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import LocationCityOutlinedIcon from '@mui/icons-material/LocationCityOutlined';
import HealthAndSafetyOutlinedIcon from '@mui/icons-material/HealthAndSafetyOutlined';
import DocumentScannerOutlinedIcon from '@mui/icons-material/DocumentScannerOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import decrypt from '../utils/decrypt';
import './template.css';


const drawerWidth = 240;

function Container(props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  const userStateEncrypt = useContext(UserLoginContext);
  const userState = JSON.parse(decrypt(userStateEncrypt.userLogin));

  const itemsList = [
    {
      text: "Cambiar Contraseña",
      icon: <PersonOutlineOutlinedIcon/>,
      path: "/perfil"
    },
    {
      text: "Solicitudes",
      icon: <DocumentScannerOutlinedIcon/>,
      path: "/solicitudes"
    },
    {
      text: "Oficinas",
      icon: <HomeWorkOutlinedIcon/>,
      path: "/oficinas"
    },
    {
      text: "Empresas",
      icon: <LocationCityOutlinedIcon />,
      path: "/empresas"
    },
    {
      text: "Personas",
      icon: <GroupOutlinedIcon/>,
      path: "/personas"
    },
    {
      text: "Incapacidades",
      icon: <HealthAndSafetyOutlinedIcon/>,
      path: "/incapacidades"
    },
    {
      text: "Reportes",
      icon: <AssessmentOutlinedIcon/>,
      path: "/Reportes"
    }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <Divider />
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
      <Divider />
      <List>
      </List>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Bienvenido {userState.nombreCompleto}
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
      </Box>
    </Box>
  );
}

Container.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default Container;