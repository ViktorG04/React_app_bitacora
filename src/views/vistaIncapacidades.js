import { ThemeProvider } from '@mui/material/styles';
import Theme from '../config/ThemeConfig';
import Template from '../components/Template';
import Incapacidades from '../components/incapacidades/incapacidades';

const VistaIncapacidades = () => {
    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <Incapacidades />
        </ThemeProvider>
    );
}
 
export default VistaIncapacidades;