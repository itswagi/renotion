import './index.css';
import { Renotion } from 'renotion';

import { kitchenSinkMarkdown } from './constants';

function App() {
  return (
    <>
      <Renotion markdown={kitchenSinkMarkdown} />
    </>
  );
}

export default App;
