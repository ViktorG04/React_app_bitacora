import { ThemeProvider } from '@mui/material/styles';
import Theme from '../config/ThemeConfig';
import Template from '../components/Template';
import Solicitudes from '../components/solicitudes/ConsultarSolicitudes';

const AdminHome = () => {
    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <Solicitudes />
        </ThemeProvider>
    );
}
 
export default AdminHome;