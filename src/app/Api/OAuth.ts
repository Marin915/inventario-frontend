export function setSessionStorage(name: string, value: string): void {
    sessionStorage.setItem(name, value);
}

// Obtener token de session storage
export function getSessionStorage(name: string): string | null {
    return sessionStorage.getItem(name);
}

// Borrar token de session storage
export function eraseSessionStorage(name: string): void {
    sessionStorage.removeItem(name);
}

export function getTokenInfo(): any {
    const token = sessionStorage.getItem("token");
    if (!token) {
        console.error('Token is null or undefined');
        return undefined;
    }
    const jwtParts = token.split('.');
    if (jwtParts.length !== 3) {
        console.error('Invalid token format');
        return undefined;
    }
    try {
        const decodedPayload = JSON.parse(atob(jwtParts[1]));
        return decodedPayload;
    } catch (error) {
        console.error('Error decoding token:', error);
        return undefined;
    }
}

export function getNombre(): string | null {
    const tokenInfo = getTokenInfo();
    if (tokenInfo && tokenInfo.nombreCompleto) {
        return tokenInfo.nombreCompleto;
    } else {
        console.error('Nombre is null or undefined');
        return null;
    }
}

export function getAdminGral(): string | null {
    const tokenInfo = getTokenInfo();
    if (tokenInfo && tokenInfo.descAdminGral) {
        return tokenInfo.descAdminGral;
    } else {
        console.error('AdminGral is null or undefined');
        return null;
    }
}

export function getRoles(rol: string): boolean {
    const tokenInfo = getTokenInfo();
    if (tokenInfo && tokenInfo.roles) {
        const roles = tokenInfo.roles.split(",");
        return roles.includes(rol);
    } else {
        console.error('Roles is null or undefined');
        return false;
    }
}

export function getRfc(): string | null {
    const tokenInfo = getTokenInfo();
    if (tokenInfo && tokenInfo.RFC_Largo) {
        return tokenInfo.RFC_Largo;
    } else {
        console.error('RFC_Largo is null or undefined');
        return null;
    }
}

export function getRfcCorto(): string | null {
    const tokenInfo = getTokenInfo();
    if (tokenInfo && tokenInfo.rfc) {
        return tokenInfo.rfc;
    } else {
        console.error('RFC_Corto is null or undefined');
        return null;
    }
}

export function isLogin(): boolean {
    try {
        const user = getTokenInfo();
        return !!user;
    } catch (error) {
        console.error('Error checking login status:', error);
        return false;
    }
}
