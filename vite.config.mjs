import {defineConfig} from 'vite';import react from '@vitejs/plugin-react';
// In dev, Vite serves the React app and forwards /api to the Node server (port 3000).
export default defineConfig({plugins:[react()],server:{proxy:{'/api':'http://localhost:3000'}}});
