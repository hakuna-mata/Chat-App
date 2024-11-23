import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx';
import './index.css';
import ChatProvider from './Context/ChatProvider.jsx';
import {ReactQueryDevtools} from '@tanstack/react-query-devtools'
import {QueryClientProvider,QueryClient} from '@tanstack/react-query'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ChatProvider>
        <ChakraProvider>
          <QueryClientProvider client={queryClient}>
          <App />
          <ReactQueryDevtools initialIsOpen={false}/>
          </QueryClientProvider>
        </ChakraProvider>
      </ChatProvider>
    </BrowserRouter>
  </StrictMode>
);
