import ReactDOM from 'react-dom';
import App from './App';
import Dashboard from './Dashboard';

// Test multiple ReactDOM conversions in one file
ReactDOM.render(<App />, typeof document !== "undefined" ? document.getElementById('root') : null);
ReactDOM.hydrate(<Dashboard />, typeof document !== "undefined" ? document.getElementById('dashboard') : null);