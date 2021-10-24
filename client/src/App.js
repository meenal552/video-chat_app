import "./App.css";
import { Component } from "react";
// import { Router } from "react-router";
// import { Route, Switch } from "react-router-dom";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import Roompage from "./Components/Roompage";
import RoomNotFound from "./Components/RoomNotFound";
import JoinRoom from "./Components/JoinRoom";
import Footer from "./Components/Footer";
import history from "./History";

function App() {
  return (
    <Router history={history}>
      <Route path="/" component={Roompage} exact />
      <Route path="/room/:id" component={JoinRoom} exact />
      <Route exact path="/room-not-found" component={RoomNotFound} />
      <Footer />
    </Router>
  );
}

export default App;
