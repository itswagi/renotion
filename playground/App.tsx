import { Renotion } from '../src';
import './App.css';
import { kitchenSinkMarkdown } from './constants';

function App() {
  return (
    <>
      <Renotion
        markdown={`# 📝 Markdown Kitchen Sink

## Second Heading
## Second Heading
## Second Heading
## Second Heading`}
      />
    </>
  );
}

export default App;
