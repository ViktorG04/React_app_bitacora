import { ThemeProvider } from '@mui/material/styles';
import Theme from '../config/ThemeConfig';
import Template from '../components/Template';
import CrearSolicitud from '../components/solicitudes/CrearSolicitud';

const VistaCrearSolicitud = () => {
    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <CrearSolicitud/>
        </ThemeProvider>
    );
}
 
export default VistaCrearSolicitud;