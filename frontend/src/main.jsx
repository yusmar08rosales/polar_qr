import React from 'react'
import './index.css'
import ReactDOM from 'react-dom/client'

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { HashRouter, Route, Routes } from "react-router-dom";

import { AuthProvider } from './auth/AuthContext.jsx';
import ProtectedRoute from './route/ProtectedRouter.jsx';
import App from './App.jsx'
import Registro from './formularios/registro.jsx';
import Desbloqueo from './formularios/desbloqueo.jsx';
import ListaLotes from './listadosLotes/ListLotes.jsx';
import LoteListado from './listadosLotes/LoteListado.jsx';
import AgregarLote from './formularios/AgregarLote.jsx';
import ListaLoteSeniat from './listadosLotes/ListaLoteSeniat.jsx';
import ListaProductSeniat from './listadosLotes/ListaProductSeniat.jsx';
import History from './listadosLotes/History.jsx';
import ListUsers from './listadosLotes/ListUsers.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
	<AuthProvider>
		<HashRouter>
			<Routes>
				<Route path='/' element={<App />} />
				<Route path='/desbloqueo' element={<Desbloqueo />} />

				{/* Rutas para roles */}
				{/* ... otras rutas ... */}
				<Route path='/registro' element={
					<ProtectedRoute roles={['admin']}>
						<Registro />
					</ProtectedRoute>
				} />

				<Route path='/registroLote' element={
					<ProtectedRoute roles={['admin', 'pasante']}>
						<AgregarLote />
					</ProtectedRoute>
				} />

				<Route path='/lote' element={
					<ProtectedRoute roles={['admin']}>
						<ListaLotes />
					</ProtectedRoute>
				} />
				<Route path='/LoteListado' element={
					<ProtectedRoute roles={['admin']}>
						<LoteListado />
					</ProtectedRoute>
				} />
				<Route path='/History' element={
					<ProtectedRoute roles={['admin']}>
						<History />
					</ProtectedRoute>
				} />
				<Route path='/ListaU' element={
					<ProtectedRoute roles={['admin']}>
						<ListUsers />
					</ProtectedRoute>
				} />
				<Route path='/ListadoLote' element={
					<ProtectedRoute roles={['seniat']}>
						<ListaLoteSeniat />
					</ProtectedRoute>
				} />
				<Route path='/ListadoProducto' element={
					<ProtectedRoute roles={['seniat']}>
						<ListaProductSeniat />
					</ProtectedRoute>
				} />
			</Routes>
		</HashRouter>
	</AuthProvider>,
)
