import { ENDPOINTS_API_PRIVATE } from "../Api/ApiServiceCore";
import { REQUEST_METHOD } from "../modelo/constans";

// Variables globales para almacenar el estado
let isAuthenticated = false;
export let adminSelect = { registros: "", name: "" };
export let apiAdmGral = [];
export let apiAdmGralbyRfc = [];
let apiIndicadorbyGral = [];
let apiIndicadorInfo = [];
let apiIndicadorValue = [];
let apiGraficInfo = [];
let apiIndicadorReport = [];
let apiFichaTecnica = [];

// Función para notificar cambios (opcional, puedes usar eventos o callbacks)
function notifyChange(callback: () => void) {
    if (typeof callback === "function") {
        callback();
    }
}

// Función para cargar los datos desde la API Admin Gral
export async function getAdmGral() {
    const url = `${ENDPOINTS_API_PRIVATE.admGeneral.byRFC}`;
    try {
        const response = await fetch(url, {
            method: REQUEST_METHOD.GET,
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }

        const data = await response.json();   // Parsea la respuesta JSON
        apiAdmGral = data;     // Almacena los resultados en el estado
    
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

export async function getAdmGralByRfc(rfcCorto: string) {
    const url = `${ENDPOINTS_API_PRIVATE.admGeneral.byRFC}?rfc=${rfcCorto}`;
    try {
        const response = await fetch(url, {
            method: REQUEST_METHOD.GET,
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }

        const data = await response.json();   // Parsea la respuesta JSON
        apiAdmGralbyRfc = data;     // Almacena los resultados en el estado
    
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

export async function getIndicadorbyGral(idGral: any) {
    const url = `${ENDPOINTS_API_PRIVATE.indicador.byAdmGral}${idGral}`;
    try {
        const response = await fetch(url, {
            method: REQUEST_METHOD.GET,
        });

        if (!response.ok) {
            throw new Error('Error al obtener datos de la API');
        }

        const data = await response.json();   // Parsea la respuesta JSON
        apiIndicadorbyGral = data;     // Almacena los resultados en el estado
    
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}

export async function getIndicadorInfo(idIndicador: any) {
    const url = `${ENDPOINTS_API_PRIVATE.indicador.infoIndicador}${idIndicador}`;

    try {
        const response = await fetch(url, {
            method: REQUEST_METHOD.GET,
        });

        if (!response.ok) {
            throw new Error('Error al optener los datos de la API');
        }

        const data = await response.json();
        apiIndicadorInfo = data;
    } catch (error) {
        console.error('Error al obtener los datos: ', error)
    }
}

export async function getIndicadorValue(idIndicador: any) {
    const url = `${ENDPOINTS_API_PRIVATE.indicador.valueByIndicador}${idIndicador}`;

    try {
        const response = await fetch(url, {
            method: REQUEST_METHOD.GET,
        });

        if (!response.ok) {
            throw new Error('Error al optener los datos de la API');
        }

        const data = await response.json();
        apiIndicadorValue = data;
    } catch (error) {
        console.error('Error al obtener los datos: ', error)
    }
}

export async function getGraficInfo(idIndicador: any) {
    const url = `${ENDPOINTS_API_PRIVATE.indicador.infoGrafic}${idIndicador}`;

    try {
        const response = await fetch(url, {
            method: REQUEST_METHOD.GET,
        });

        if (!response.ok) {
            throw new Error('Error al optener los datos de la API');
        }

        const data = await response.json();
        apiGraficInfo = data;
    } catch (error) {
        console.error('Error al obtener los datos: ', error)
    }
}

export async function getReportInfo(idAdminGral: any) {
    const url = `${ENDPOINTS_API_PRIVATE.indicador.reporteIndicador}${idAdminGral}`;

    try {
        const response = await fetch(url, {
            method: REQUEST_METHOD.GET,
        });

        if (!response.ok) {
            throw new Error('Error al optener los datos de la API');
        }

        const data = await response.json();
        apiIndicadorReport = data;
    } catch (error) {
        console.error('Error al obtener los datos: ', error)
    }
}