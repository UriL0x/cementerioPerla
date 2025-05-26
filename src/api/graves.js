import axios from "axios";
import { BASE_ROUTE } from "./dceasced";
import { getTokenOfSession } from "../utils/session";

export function getAllGraves() {
    return axios.get(BASE_ROUTE + 'graves/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function deleteGraves(id) {
    return axios.delete(BASE_ROUTE + 'graves/' + id + '/', {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function addGrave(data) {
    return axios.post(BASE_ROUTE + 'graves/', data, {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}

export function editGrave(id, data) {
    return axios.put(BASE_ROUTE + 'graves/' + id + '/', data, {
            headers: 
                {Authorization: `Token ${getTokenOfSession()}`}
        });
}