
import './App.css';
import Header from './components/Header'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Login from './pages/login'
import Home from './pages/home'
import { useEffect, useState } from 'react';
import { SnackbarProvider } from 'notistack';
import { StoreProvider } from './utils/Store';
import useStyles from "./utils/styles";



function App({ ...props }) {

  const css = useStyles();
  return (
    <StoreProvider>
      <SnackbarProvider anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <BrowserRouter>
          
            <div className={`App`}>
              <Header />
            </div>
          
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/" component={Home} />
          </Switch>
        </BrowserRouter>
      </SnackbarProvider>
    </StoreProvider>

  );
}

export default App;


