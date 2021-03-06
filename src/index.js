import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'fullcalendar-reactwrapper/dist/css/fullcalendar.min.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
