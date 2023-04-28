import logo from './logo.svg';
import './App.css';
import NavBar from './components/NavBar';
import Banner from './components/Banner';
import Movies from './components/Movies';
import Favourite from './components/Favourite';
import {BrowserRouter as Router,Switch,Route, BrowserRouter} from 'react-router-dom';

function App() {
  return (
    <Router>
      <NavBar/>
      <Switch>
        <Route path='/' exact render={(props)=>(
          <>
            <Banner {...props}/>
            <Movies {...props}/>
          </>
        )}/>
        <Route path='/favourites' component={Favourite} />
      </Switch>
    </Router>
  );
}

export default App;