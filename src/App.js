import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import "./App.css";
import Lobby from "./lobby/lobby"
import Game from "./game/Game"

function App() {
  return (
    <Router>
      <Switch>
      <Route 
        exact
        path="/"
      >
        <Lobby />
      </Route>
      <Route 
        exact
        path="/game/:id"
        // path="/asd"
      >
        <Game />
      </Route>
      </Switch>
    </Router>
  );
}

export default App;
