import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConsumerProvider } from './contexts/ConsumerContext.tsx'

createRoot(document.getElementById("root")!).render(
  <ConsumerProvider>
    <App />
  </ConsumerProvider>
);
