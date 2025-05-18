import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import App from "@/App";
import { AppProvider } from "@/context/AppContext";
import { UserProvider } from "@/context/UserContext";
import { AppThemeProvider } from "@/context/ThemeContext";
import { ChakraProvider } from "@chakra-ui/react";

import { ToastContainer, } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AppProvider>
        <AppThemeProvider>
          <UserProvider>
            <ChakraProvider>
              <App />
              <ToastContainer />
            </ChakraProvider>
          </UserProvider>
        </AppThemeProvider>
      </AppProvider>
    </Router>
  </React.StrictMode>
);
