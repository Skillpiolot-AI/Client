


import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './AuthContext'; // Adjust path as needed
import './index.css';
import { NextUIProvider } from '@nextui-org/react';

import { ChakraProvider } from '@chakra-ui/react'
import { GoogleOAuthProvider } from '@react-oauth/google';

import { CurrencyProvider } from './CurrencyContext';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="860946075972-h9p02v2019ad2n7rfco6dkil6resstqk.apps.googleusercontent.com">
      <ChakraProvider>
        <NextUIProvider>
          <CurrencyProvider>
            <AuthProvider>
              <App />
            </AuthProvider>
          </CurrencyProvider>
        </NextUIProvider>
      </ChakraProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);
