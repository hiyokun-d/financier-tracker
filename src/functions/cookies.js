let name = "dataUser";

export function addCookie(value, nameA = name) {
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 5).toUTCString();
    document.cookie = `${nameA}=${encodeURIComponent(value || '')}; expires=${expires}; path=/`;
}

export function getCookieSize(name) {
    let cookieValue = document.cookie.split('; ').find(row => row.startsWith(name + '='));
    if (!cookieValue) {
        return 0;
    }
    return cookieValue.length;
}

export function isCookieFull() {
    const cookieSizeLimit = 4096;
    const currentCookieSize = getCookieSize(name);

    return currentCookieSize >= cookieSizeLimit;
}

export function saveState(state) {
    addCookie(JSON.stringify(state));
}

export function loadState() {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith(`${name}=`));
    if (cookie) {
        const value = decodeURIComponent(cookie.split('=')[1]);
        try {
            return JSON.parse(value);
        } catch (e) {
            console.error('Error parsing cookie data:', e);
            return undefined;
        }
    }
    return undefined;
}

export function updateState(state, setState) {
    return (newState) => {
        const updatedState = { ...state, ...newState };
        saveState(updatedState);
        setState(updatedState);
    };
}