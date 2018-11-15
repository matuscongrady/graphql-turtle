import MainView from '@components/MainView';
import { AppBar, CircularProgress, CssBaseline, Toolbar, Typography } from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/Explore';
import useFetch from 'fetch-suspense';
import * as React from 'react';
import { hot, setConfig } from 'react-hot-loader';
import { CONFIG_URL } from './contants';

setConfig({ pureSFC: true } as any);

const MainAppWithExistingConfig = () => {
  const config = useFetch(CONFIG_URL);
  return (
    <div>
      <MainView config={config} />
    </div>
  );
};

const App = () => {
  return (
    <div>
      <CssBaseline />
      <AppBar position="static" style={{ position: 'relative', paddingLeft: '13%' }}>
        <Toolbar>
          <ExploreIcon />
          <Typography variant="h5" color="inherit" noWrap style={{ paddingLeft: '15px' }}>
            GraphQL Turtle - Authorization config
          </Typography>
        </Toolbar>
      </AppBar>
      {process.env.IS_CREATE_MODE ? (
        <MainView />
      ) : (
        <React.Suspense fallback={<CircularProgress />}>
          <MainAppWithExistingConfig />
        </React.Suspense>
      )}
    </div>
  );
};

export default hot(module)(App);
