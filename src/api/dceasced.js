import axios from "axios";
import { getTokenOfSession } from "../utils/session";

export const BASE_ROUTE = 'https://urubio0.pythonanywhere.com/cementerio/api/';

export function getAllDceasced() {
    return axios.get(BASE_ROUTE + 'dceasced/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function deleteDceasced(id) {
    return axios.delete(BASE_ROUTE + 'dceasced/' + id + '/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function addDceased(data) {
    return axios.post(BASE_ROUTE + 'dceasced/', data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${getTokenOfSession()}`
            },
        }
    );
}

export function editDceased(id, data) {
    return axios.put(BASE_ROUTE + 'dceasced/' + id + '/', data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${getTokenOfSession()}`
            },
        }
    );
}

export function getAllDocs() {
    return axios.get(BASE_ROUTE + 'dceasced/documents/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function uploadDoc(data) {
    return axios.post(BASE_ROUTE + 'documents/', data,
        {
            headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Token ${getTokenOfSession()}`
            },
        }
    );
}

export function deleteDoc(id) {
    return axios.delete(BASE_ROUTE + 'documents/' + id + '/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function getDocsDceased(data) {
    return axios.get(BASE_ROUTE + 'admin/dceasced/docs/', data, {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}