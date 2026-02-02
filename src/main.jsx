


import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Adjust path as needed
import './styles/index.css';
import { NextUIProvider } from '@nextui-org/react';

import { ChakraProvider } from '@chakra-ui/react'
import { GoogleOAuthProvider } from '@react-oauth/google';
ReactDOM.render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId="860946075972-h9p02v2019ad2n7rfco6dkil6resstqk.apps.googleusercontent.com">
      <ChakraProvider>
        <NextUIProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NextUIProvider>
      </ChakraProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
