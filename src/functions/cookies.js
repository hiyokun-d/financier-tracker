let name = "dataUser";

export function addCookie(value) {
    // Set the cookie with an expiration date of 5 years from now
    const expires = new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 * 5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value || '')}; expires=${expires}; path=/`;
}

export function saveState(state) {
    // Save the state to the cookie as a JSON string
    addCookie(JSON.stringify(state));
}

export function loadState() {
    // Load the cookie and parse its value as JSON
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith(`${name}=`));
    if (cookie) {
        const value = decodeURIComponent(cookie.split('=')[1]);
        try {
            return JSON.parse(value);  // Return the parsed JSON state
        } catch (e) {
            console.error('Error parsing cookie data:', e);
            return undefined;
        }
    }
    return undefined;
}

export function updateState(state, setState) {
    return (newState) => {
        // Merge the current state with the new state
        const updatedState = { ...state, ...newState };
        // Save the updated state and set it
        saveState(updatedState);
        setState(updatedState);
    };
}