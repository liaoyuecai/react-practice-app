import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import store from './store';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import 'normalize.css';
import './static/style/common.less';

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>,	
	document.getElementById('root')
);
registerServiceWorker();
