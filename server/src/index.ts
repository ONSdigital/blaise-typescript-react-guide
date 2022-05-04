import server from './server';

const port = 5000;

// eslint-disable-next-line no-console
server().listen(port, () => console.log(`Running on port ${port}`));
