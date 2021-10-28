import  axios from 'axios'

//const axiosClient =  process.env.REACT_APP_BACKEND_URL;

const axiosClient = 'http://localhost:5000';

//Solicitudes

export const getSolicitudes = async (id) => {
    id = id || '';
    return await axios.get(`${axiosClient}/api/solicitudes/empleado/1/${id}`);//listar solo las solicitudes del usuario logeado
}

export const buscarSolicitudes = async (id) => {
    id = id || '';
    return await axios.get(`${axiosClient}/api/solicitudes/${id}`);
}

export const addSolicitud = async (solicitud) => {
    return await axios.post(`${axiosClient}/api/solicitudes/empleado`, solicitud);
}

export const deleteSolicitud = async (idSolicitud) => {
    return await axios.delete(`${axiosClient}/${idSolicitud}`);
}

export const editSolicitud = async (solicitud) => {
    return await axios.put(`${axiosClient}/api/solicitudes/`, solicitud)
}

export const editEstadoSol = async (id) => {
    return await axios.put(`${axiosClient}/solicitudes/estado/${id}`)
}

//empresa
export const getEmpresas = async =>{
    return axios.get(`${axiosClient}/api/companies`);
}

export const buscarEmpresa = async (id) => {
    id = id || '';
    return await axios.get(`${axiosClient}/api/companies/${id}`);
}

export const editEmpresa = async (empresa) => {
    return await axios.put(`${axiosClient}/api/companies/`, empresa);
}


//oficinas
export const getOficinas = async =>{
    return axios.get(`${axiosClient}/api/areas`)
}

export const buscarOficina = async (id) => {
    id = id || '';
    return await axios.get(`${axiosClient}/api/areas/${id}`);
}

export const editOficina = async (oficina) => {
    return await axios.put(`${axiosClient}/api/areas/`, oficina);
}

export const addOficina = async (oficina) => {
    return await axios.post(`${axiosClient}/api/areas`, oficina);
}


//personas
export const getPersonas = async =>{
    return axios.get(`${axiosClient}/api/persons`);
}

export const getPersonasPorEmpresa = async (id) =>{
    return await axios.get(`${axiosClient}/api/persons/byIdCompany/${id}`);
}

export const getEmpleados = async=>{
    return axios.get(`${axiosClient}/api/users/incapacidad`);
}

export const updateEstadoPersona = async (estado) => {
    return await axios.put(`${axiosClient}/api/persons/state`, estado);
}

export const buscarPersona = async (id) => {
    id = id || '';
    return await axios.get(`${axiosClient}/api/persons/${id}`);
}

export const updatePersona = async (persona) => {
    return await axios.put(`${axiosClient}/api/persons`, persona);
}

export const updateEmpleado = async (empleado) => {
    return await axios.put(`${axiosClient}/api/users`, empleado);
}

export const addEmpleado = async (empleado) => {
    return await axios.post(`${axiosClient}/api/users/`, empleado);
}


//roles
export const getRoles = async =>{
    return axios.get(`${axiosClient}/api/roles`);
}

//estados
export const getEstados = async=>{
    return axios.get(`${axiosClient}/api/states`);
}

//incapacidades
export const getIncapacidades = async =>{
    return axios.get(`${axiosClient}/api/incapacidades`);
}

export const addIncapacidad = async (incapacidad) => {
    return await axios.post(`${axiosClient}/api/incapacidades/`, incapacidad);
}

export default axiosClient;