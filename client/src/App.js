import logo from './photo/logo.png';
import './App.css';
import TicTacToe from './main/TicTacToe';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          WELCOME <br /> Play Tic Tac Toe Against AI (Artificial Inteligence)
        </p>
        <TicTacToe />
      </header>
    </div>
  );
}

export default App;
