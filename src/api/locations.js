import axios from "axios";
import { getTokenOfSession } from "../utils/session";

let BASE_ROUTE = 'http://localhost:8000/cementerio/api/';

// Metodos para bloques
export function getAllBlocks() {
    return axios.get(BASE_ROUTE + 'blocks/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function deleteBlock(id) {
    return axios.delete(BASE_ROUTE + 'blocks/' + id + '/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function addBlock(data) {
    return axios.post(BASE_ROUTE + 'blocks/', data, {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function editBlock(id, data) {
    return axios.put(BASE_ROUTE + 'blocks/' + id + '/', data, {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

// Metodos para filas
export function getAllRow() {
    return axios.get(BASE_ROUTE + 'rows/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function deleteRow(id) {
    return axios.delete(BASE_ROUTE + 'rows/' + id + '/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function addRow(data) {
    return axios.post(BASE_ROUTE + 'rows/', data, {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function editRow(id, data) {
    return axios.put(BASE_ROUTE + 'rows/' + id + '/', data, {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

// Metodos para secciones
export function getAllSection() {
    return axios.get(BASE_ROUTE + 'sections/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function deleteSection(id) {
    return axios.delete(BASE_ROUTE + 'sections/' + id + '/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function addSection(data) {
    return axios.post(BASE_ROUTE + 'sections/', data, {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function editSection(id, data) {
    return axios.put(BASE_ROUTE + 'sections/' + id + '/', data, {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}
