import React, { useMemo, useState } from 'react';
import './App.css';
import APIContext from './components/APIContext';
import SurveySelector from './components/SurveySelector';

function App() {
  const [selected, setSelected] = useState<string[]>([]);
  const apiConfig = useMemo(
    () => ({ endpoint: 'http://localhost:5000' }),
    [],
  );

  return (
    <div className="App">
      <APIContext.Provider value={apiConfig}>
        <SurveySelector onUpdate={(surveys) => setSelected(surveys)} />
      </APIContext.Provider>
      <div>
        Selected Surveys:
        {' '}
        {selected.join(', ')}
      </div>
    </div>
  );
}

export default App;
