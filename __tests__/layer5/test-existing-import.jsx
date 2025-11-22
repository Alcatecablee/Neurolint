import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';

// Test that we don't duplicate existing imports
const existingRoot = createRoot(typeof document !== "undefined" ? document.getElementById('existing') : null);
existingRoot.render(<div>Existing</div>);

// This should add hydrateRoot to the existing import
ReactDOM.hydrate(<App />, typeof document !== "undefined" ? document.getElementById('root') : null);