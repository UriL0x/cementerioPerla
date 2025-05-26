import axios from "axios";
import { BASE_ROUTE } from "./dceasced";
import { getTokenOfSession } from "../utils/session";

export function login(data) {
    return axios.post(BASE_ROUTE + 'admin/login/', data);
}

export function register(data) {
    return axios.post(BASE_ROUTE + 'admin/register/', data, {
        headers: 
            {Authorization: `Token ${getTokenOfSession()}`}
    });
}

export function getAllUsers() {
    return axios.get(BASE_ROUTE + 'users/', {
        headers: 
            {Authorization: `Token ${getTokenOfSession()}`}
    });
}

export function deleteUser(id) {
    return axios.delete(BASE_ROUTE + 'users/' + id + '/', {
        headers: 
            {Authorization: `Token ${getTokenOfSession()}`}
    });
}

export function updateUser(id, data) {
    return axios.put(BASE_ROUTE + 'users/' + id + '/', data, {
        headers: 
            {Authorization: `Token ${getTokenOfSession()}`}
    });
}

export function updateUserPrivileges(data) {
    return axios.post(BASE_ROUTE + 'admin/ascend/', data, {
        headers: 
            {Authorization: `Token ${getTokenOfSession()}`}
    });
}

