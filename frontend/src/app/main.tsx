
import { pdfjs } from 'react-pdf';
import 'pdfjs-dist/legacy/web/pdf_viewer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { RouterProvider } from 'react-router-dom';
import RootNavigator from './navigation/RootNavigator';
import { store } from './store/stores';

import './index.css';
import { Provider } from 'react-redux';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <ChakraProvider>
        <RouterProvider router={RootNavigator()} />
      </ChakraProvider>
    </Provider>
  </StrictMode>,
);
