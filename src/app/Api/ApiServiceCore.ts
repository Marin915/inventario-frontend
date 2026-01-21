
import { environment } from '../../Environments/environment.development';

export const URL_BASE =environment.url;

export const URL_BASE_APP_API = environment.API_URL;

export const URL_LOGOUT = environment.URL_LOGOUT;

export const URL_REDIRECT = environment.URL_REDIRECT;

export const ENDPOINTS_API_PRIVATE = {
    count: `${URL_BASE}/Api/ConsultaCartaInvitacion/consultar`,
    identidad: {
        login: `${URL_BASE_APP_API}Oauth/login`,
        token: `${URL_BASE_APP_API}Oauth`,
    },
    admGeneral:{
        byRFC: `${URL_BASE_APP_API}AdmGeneral/AdmgeneralesPorRFCOpcional/`
    },
    indicador:{
        byAdmGral: `${URL_BASE_APP_API}Indicador/IndicadoresPorAdmGeneralId/`,
        infoIndicador: `${URL_BASE_APP_API}Indicador/InfoIndicadorPorIndicador/`, 
        valueByIndicador: `${URL_BASE_APP_API}Indicador/ValoresPorIndicador/`,
        infoGrafic: `${URL_BASE_APP_API}Indicador/GraficaInfoResultadosPorIndicador/`,
        reporteIndicador: `${URL_BASE_APP_API}Indicador/IndicadoresReportePorAdmGeneral/`,
        capturaIndicador: `${URL_BASE_APP_API}Indicador/RegistroValoresIndicador/`,
    },
}