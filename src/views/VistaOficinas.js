import { ThemeProvider } from '@mui/material/styles';
import Theme from '../config/ThemeConfig';
import Template from '../components/Template';
import Oficinas from '../components/oficinas/ConsultarOficinas';

const VistaOficinas = () => {
    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <Oficinas />
        </ThemeProvider>
    );
}
 
export default VistaOficinas;