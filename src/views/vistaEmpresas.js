import { ThemeProvider } from '@mui/material/styles';
import Theme from '../config/ThemeConfig';
import Template from '../components/Template';
import Empresas from '../components/empresas/empresas';

const VistaEmpresas = () => {
    return (
        <ThemeProvider theme={Theme} >
            <Template />
            <Empresas />
        </ThemeProvider>
    );
}
 
export default VistaEmpresas;