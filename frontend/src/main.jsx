import React from 'react'
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
import './index.css'

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
					<ProtectedRoute roles={['admin']}>
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
			</Routes>
		</HashRouter>
	</AuthProvider>,
)
