import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('main.tsx: Starting to render');

const rootElement = document.getElementById("root");
console.log('main.tsx: Root element found:', rootElement);

if (!rootElement) {
  console.error('main.tsx: Root element not found!');
} else {
  const root = createRoot(rootElement);
  console.log('main.tsx: Root created');
  
  root.render(
    <>
      <App />
    </>
  );
  console.log('main.tsx: Render called');
}