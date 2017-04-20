import axios from 'axios';
import * as Util from './Util';

export function get(url: string) {
    return axios.get(Util.cleanUrl(url))
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