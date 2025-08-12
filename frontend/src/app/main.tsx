import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import LandingPage from '@/features/landing/landing-page';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ChakraProvider>
      <LandingPage />
    </ChakraProvider>
  </StrictMode>,
);
