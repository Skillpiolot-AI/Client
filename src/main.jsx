


import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './AuthContext'; // Adjust path as needed
import './index.css';
import { NextUIProvider } from '@nextui-org/react';

import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.render(
  <BrowserRouter>
  <ChakraProvider>
    <NextUIProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </NextUIProvider>
  </ChakraProvider>
  </BrowserRouter>,
  document.getElementById('root')
);
