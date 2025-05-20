export const getHeaders = (item = '@ACCESS_TOKEN') => {
    const token = sessionStorage.getItem(item);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    }
    return headers;
}