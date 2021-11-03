import { ThemeProvider } from '@mui/material/styles';
import Theme from '../config/ThemeConfig';
import Template from '../components/Template';
import Perfil from '../components/personas/perfil';

const VistaPerfil = () => {
    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <Perfil />
        </ThemeProvider>
    );
}
 
export default VistaPerfil;