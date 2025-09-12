import './index.css';
import { Renotion } from '../lib';

import { kitchenSinkMarkdown } from './constants';

function App() {
  return (
    <>
      <Renotion markdown={kitchenSinkMarkdown} />
    </>
  );
}

export default App;
