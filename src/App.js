import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AuthProvider from './context/login/AuthProvider';
import Login from './views/Login'
import vistaSolicitudes from './views/vistaSolicitudes';
import CrearSolicitud from './components/solicitudes/CrearSolicitud';
import EditarSolicitud from './components/solicitudes/EditarSolicitud';
import VistaOficinas from './views/VistaOficinas';
import EditarOficina from './components/oficinas/EditarOficina';
import CrearOficina from './components/oficinas/CrearOficina';
import Empresas from './views/empresas';
import EditarEmpresa from './components/empresas/EditarEmpresa';
import Personas from './views/personas';
import EditarPersona from './components/personas/EditarPersona';
import CrearUsuario from './components/personas/CrearUsuario';
import Incapacidades from './views/incapacidades';
import CrearIncapacidad from './components/incapacidades/CrearIncapacidad';
import Visitas from './components/reportes/visitas';
import VisitasOficina from './components/reportes/oficinas';
import Nexos from './components/incapacidades/nexos';

const useStyles = makeStyles({
  container: {
    display: "flex"
  }
});

function App() {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <AuthProvider>
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />
                    <Route exact path="/solicitudes" component={vistaSolicitudes} />
                    <Route exact path="/crearsolicitud" component={CrearSolicitud} />
                    <Route exact path="/editarsolicitud/:id" component={EditarSolicitud} />
                    
                    <Route exact path="/oficinas" component={VistaOficinas} />
                    <Route exact path="/editarOficina/:id" component={EditarOficina} />
                    <Route exact path="/crearOficina" component={CrearOficina} />

                    <Route exact path="/empresas" component={Empresas}/>
                    <Route exact path="/editarEmpresa/:id" component={EditarEmpresa} />

                    <Route exact path="/personas" component={Personas}/>
                    <Route exact path="/crearEmpleado" component={CrearUsuario}/>
                    <Route exact path="/editarPersona/:id" component={EditarPersona} />

                    <Route exact path="/incapacidades" component={Incapacidades}/>
                    <Route exact path="/crearIncapacidad" component={CrearIncapacidad} />
                    <Route exact path="/nexosPorIncapacidad/:id" component={Nexos} />

                    <Route exact path="/reportes/visitas" component={Visitas}/>
                    <Route exact path="/reportes/oficinas" component={VisitasOficina}/>
                </Switch>
            </Router>
        </AuthProvider>
    </div>
  );
}

export default App;
