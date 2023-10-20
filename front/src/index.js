import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import 'semantic-ui-css/semantic.min.css'
import {Context, AppContext} from './Context';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Context>
    <App />
  </Context>
);
reportWebVitals();
