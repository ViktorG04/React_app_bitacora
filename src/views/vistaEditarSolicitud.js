import { ThemeProvider } from '@mui/material/styles';
import Theme from '../config/ThemeConfig';
import Template from '../components/Template';
import EditarSolicitud from '../components/solicitudes/EditarSolicitud';

const VistaEditarSolicitud = () => {
    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <EditarSolicitud/>
        </ThemeProvider>
    );
}
 
export default VistaEditarSolicitud;