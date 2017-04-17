import axios from 'axios';

export function get(url: string) {
    const cleanUrl = url.replace(/\/\/+/g, '\/');

    return axios.get(cleanUrl)
        .then((response) => {
            if (response.status >= 200 &&  response.status < 400) {
                return response.data;
            } else {
                console.warn(response);
            }
        })
        .catch((error) => {
            console.error(error);
        });
}