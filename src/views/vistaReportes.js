import { ThemeProvider } from '@mui/material/styles';
import Theme from '../config/ThemeConfig';
import Template from '../components/Template';
import FiltroReportes from '../components/reportes/filtroReportes';

const VistaIncapacidades = () => {
    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <FiltroReportes />
        </ThemeProvider>
    );
}
 
export default VistaIncapacidades;