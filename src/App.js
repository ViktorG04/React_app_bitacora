import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Login from './views/Login'
import vistaSolicitudes from './views/vistaSolicitudes';
import VistaOficinas from './views/VistaOficinas';
import EditarOficina from './components/oficinas/EditarOficina';
import CrearOficina from './components/oficinas/CrearOficina';
import VistaEmpresas from './views/vistaEmpresas';
import EditarEmpresa from './components/empresas/EditarEmpresa';
import VistaPersonas from './views/vistaPersonas';
import EditarPersona from './components/personas/EditarPersona';
import CrearUsuario from './components/personas/CrearUsuario';
import VistaIncapacidades from './views/vistaIncapacidades';
import CrearIncapacidad from './components/incapacidades/CrearIncapacidad';
import Visitas from './components/reportes/visitas';
import VisitasOficina from './components/reportes/oficinas';
import Nexos from './components/incapacidades/nexos';
import CrearSolicitudExternos from './components/solicitudes/CrearSolicitudExternos';
import UserLoginContext from './context/login/UserLoginContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import DetalleSolicitud from './components/solicitudes/DetalleSolicitudes';
import EditarSolicitud from './components/solicitudes/EditarSolicitud';
import CrearSolicitud from './components/solicitudes/CrearSolicitud';
import VistaReportes from './views/vistaReportes';
import Perfil from './components/personas/perfil';

const useStyles = makeStyles({
  container: {
    display: "flex"
  }
});

function App() {
  const classes = useStyles();
  const [userLogin, setUserLogin] = useLocalStorage('userLogIn', '');

  return (
    <div className={classes.container}>
          <UserLoginContext.Provider value={{ userLogin, setUserLogin }}>
            <Router>
                <Switch>
                    <Route exact path="/" component={Login} />

                    <Route exact path="/perfil" component={Perfil}/>

                    <Route exact path="/solicitudes" component={vistaSolicitudes} />
                    <Route exact path="/crearsolicitud" component={CrearSolicitud} />
                    <Route exact path="/crearsolicitudexternos" component={CrearSolicitudExternos} />
                    <Route exact path="/editarsolicitud/:id" component={EditarSolicitud} />
                    <Route exact path="/ingresarPersonas/:id" component={DetalleSolicitud} />
                    
                    <Route exact path="/oficinas" component={VistaOficinas} />
                    <Route exact path="/editarOficina/:id" component={EditarOficina} />
                    <Route exact path="/crearOficina" component={CrearOficina} />

                    <Route exact path="/empresas" component={VistaEmpresas}/>
                    <Route exact path="/editarEmpresa/:id" component={EditarEmpresa} />

                    <Route exact path="/personas" component={VistaPersonas}/>
                    <Route exact path="/crearEmpleado" component={CrearUsuario}/>
                    <Route exact path="/editarPersona/:id" component={EditarPersona} />

                    <Route exact path="/incapacidades" component={VistaIncapacidades}/>
                    <Route exact path="/crearIncapacidad" component={CrearIncapacidad} />
                    <Route exact path="/nexosPorIncapacidad/:id" component={Nexos} />

                    <Route exact path="/reportes" component={VistaReportes} />
                    <Route exact path="/reportes/visitas" component={Visitas}/>
                    <Route exact path="/reportes/oficinas" component={VisitasOficina}/>
                </Switch>
            </Router>
          </UserLoginContext.Provider>
    </div>
  );
}

export default App;
