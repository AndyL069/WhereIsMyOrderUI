import React from "react";
import { Router, Route, Switch } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.css';
import Home from './components/Home';
import { useAuth0 } from '@auth0/auth0-react';
import history from "./utils/history";
import Loading from './components/Loading';
import NavMenu from './components/NavMenu';
import Hero from "./components/Hero";

const App = () => {
  const { isLoading, error, isAuthenticated } = useAuth0();

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Router history={history}>
      <NavMenu></NavMenu>
      <Switch>
        {isAuthenticated === true
          ? <Route exact path="/" component={Home} />
          : <Hero></Hero>}
      </Switch>
    </Router>
  );
}

export default App;
