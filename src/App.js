import './App.css';
import DeployTerm from './component/deploy';
import CheckBalance from './component/checkBalance';

function App() {
  return (
    <div className="App">
      <div>
        <DeployTerm />
      </div>
      <div>
        <CheckBalance />
      </div>
    </div>
  );
}

export default App;
