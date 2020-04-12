import React, { Component } from "react";
import Home from "./utils/Home";
import Container from "./components/Container";
import Header from "./components/Header";

function App() {

    return (
      <div>
        <Header />
        <Container>
          <Home />
        </Container>
      </div>

    );
}

export default App;