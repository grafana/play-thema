import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { ThemeProvider } from './theme';
import { StateProvider } from './state';
import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';
import { ReactIntegration } from '@grafana/faro-react';

const element = document.getElementById('root');
if (element) {
  const root: ReactDOM.Root = ReactDOM.createRoot(element);

  root.render(
    <StrictMode>
      <ThemeProvider>
        <StateProvider>
          <App />
        </StateProvider>
      </ThemeProvider>
    </StrictMode>
  );
}

// Now load and run the Go code which will register the Wasm API
const go: Go = new Go();

const sourceFile = 'thema.wasm';

// WebAssembly.instantiateStreaming() is preferred, but not all browsers support it
if (typeof WebAssembly.instantiateStreaming === 'function') {
  WebAssembly.instantiateStreaming(fetch(sourceFile), go.importObject).then((result) => {
    go.run(result.instance);
  });
} else {
  fetch(sourceFile)
    .then((response) => response.arrayBuffer())
    .then((bytes) => WebAssembly.instantiate(bytes, go.importObject))
    .then((result) => {
      go.run(result.instance);
    });
}

// Set up Grafana Faro (production-only)
if (process.env.NODE_ENV === 'production') {
  initializeFaro({
    url: process.env.REACT_APP_FARO_URL,
    app: {
      name: 'Thema Playground',
      version: '0.1.0',
      environment: 'production',
    },
    instrumentations: [
      ...getWebInstrumentations({
        captureConsole: true,
      }),
      new TracingInstrumentation(),
      new ReactIntegration(),
    ],
  });

  console.info('Faro was initialized');
}
