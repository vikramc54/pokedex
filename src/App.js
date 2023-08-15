import './App.css';
import { Switch } from "react-router";
import { BrowserRouter as Router, Link, Route } from "react-router-dom";
import Navbar from './components/Navbar';
import Pokedex from './components/Pokedex';
import Quiz from './components/Quiz';
import Pokemon from './components/Pokemon';
import Home from './components/Home';


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/pokedex" component={Pokedex} />
          <Route path="/quiz" component={Quiz} />
          <Route path="/pokemon/:pokemonName" component={Pokemon} />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
