export const getAppBaseUrl = function getAppBaseUrl() {
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:8086'
    }
    const host = window.location.host
    const protocol = window.location.protocol

    if (host.startsWith('www.')) {
        let newHost = host.replace('www.', '')
        return `${protocol}//www.api.${newHost}`
    } else {
        return `${protocol}//api.${host}`
    }
}
