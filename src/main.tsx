import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ConsumerProvider } from './contexts/ConsumerContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <ConsumerProvider>
      <App />
    </ConsumerProvider>
  </AuthProvider>
);
