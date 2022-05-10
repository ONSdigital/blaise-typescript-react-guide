import React, { useMemo } from 'react';
import './App.css';
import APIContext from './components/APIContext';
import SurveySelector from './components/SurveySelector';

function App() {
  const apiConfig = useMemo(
    () => ({ endpoint: 'http://localhost:5000' }),
    [],
  );

  return (
    <div className="App">
      <APIContext.Provider value={apiConfig}>
        <SurveySelector onUpdate={(surveys) => console.log(surveys)} />
      </APIContext.Provider>
    </div>
  );
}

export default App;
