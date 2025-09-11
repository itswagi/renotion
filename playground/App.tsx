import './index.css';
import { Renotion } from '../src';

import { kitchenSinkMarkdown } from './constants';

function App() {
  return (
    <>
      <Renotion markdown={kitchenSinkMarkdown} />
    </>
  );
}

export default App;
