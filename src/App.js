/*
  En este archivo se definen las rutas,
  cada ruta tiene un componente asignado
*/

import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; 
import Header from './layouts/header';
import AdminPanel from './layouts/admin/main';
import Login from './layouts/login';
import { DceascedPanel } from './layouts/admin/dceasced';
import { UsersPanel } from './layouts/admin/users';
import GravesPanel from './layouts/admin/graves';
import LocationsPanel from './layouts/admin/locations';
import NotFound from './layouts/notFound';
import { useState } from 'react';

function App() {

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/iniciar_sesion" element={<Login />} />
        <Route path="/admin/difuntos" element={<DceascedPanel/>} />
        <Route path="/admin/usuarios" element={<UsersPanel/>} />
        <Route path="/admin/tumbas" element={<GravesPanel/>} />
        <Route path="/admin/ubicaciones" element={<LocationsPanel/>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
