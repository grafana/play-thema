import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import { ThemeProvider } from './theme';
import { StateProvider } from './state';

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

// Set up Grafana Faro
import { getWebInstrumentations, initializeFaro } from '@grafana/faro-web-sdk';
import { TracingInstrumentation } from '@grafana/faro-web-tracing';

initializeFaro({
  url: 'https://faro-collector-ops-us-east-0.grafana-ops.net/collect/c77a29db08562f50b90e199f4202ee78',
  app: {
    name: 'Thema Playground',
    version: '0.1.0',
    environment: 'production',
  },
  instrumentations: [
    // Mandatory, overwriting the instrumentations array would cause the default instrumentations to be omitted
    ...getWebInstrumentations(),

    // Mandatory, initialization of the tracing package
    new TracingInstrumentation(),
  ],
});
