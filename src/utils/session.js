/* Este archivo es para menajar la sesion
 del usuario y sus privilegios */

const authtoken = 'authtoken';
const user = 'user';

export function checkSession() {
    return !!localStorage.getItem(authtoken);
}

export function setSession(data) {
    localStorage.setItem(authtoken, data.token);
    localStorage.setItem(user, JSON.stringify(data.user));

}

export function getDataOfSession() {
    if (!localStorage.getItem(user)) {
        checkSession();
    }

    return JSON.parse(localStorage.getItem('user'));
}

export function getTokenOfSession() {
    if (!localStorage.getItem(authtoken)) {
        checkSession();
    }

    return localStorage.getItem('authtoken');
}

export function closeSession() {
    localStorage.removeItem(authtoken);
    localStorage.removeItem(user);
}

export function checkPrivileges() {
   const userData = JSON.parse(localStorage.getItem(user));

   return !!userData.is_admin;
}