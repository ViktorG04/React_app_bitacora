import { ThemeProvider } from '@mui/material/styles';
import Theme from '../config/ThemeConfig';
import Template from '../components/Template';
import Personas from '../components/personas/personas';

const VistaPersonas = () => {
    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <Personas />
        </ThemeProvider>
    );
}
 
export default VistaPersonas;