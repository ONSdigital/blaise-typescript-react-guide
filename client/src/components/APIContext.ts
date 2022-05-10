import React from 'react';

interface APIContextValue {
  endpoint: string;
}

const APIContext = React.createContext<APIContextValue>({ endpoint: 'http://locahost:5000' });

export default APIContext;
