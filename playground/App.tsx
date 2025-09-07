import { createTheme, Renotion } from '../src';
import './App.css';
import { kitchenSinkMarkdown } from './constants';

function App() {
  return (
    <>
      <Renotion markdown={kitchenSinkMarkdown} />
    </>
  );
}

export default App;
