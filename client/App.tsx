import { useConfig } from '@/utils/data-fetching';
import { ErrorMessage } from '@components/_reusable/ErrorMessage';
import MainView from '@components/MainView';
import { AppBar, CircularProgress, CssBaseline, Toolbar, Typography } from '@material-ui/core';
import LogoIcon from '@material-ui/icons/dns';
import { Router } from '@reach/router';
import * as React from 'react';
import { hot, setConfig as setHotLoaderConfig } from 'react-hot-loader';

setHotLoaderConfig({ pureSFC: true } as any);

const MainViewInEditMode = (_props: any) => {
  const { loading, error, config } = useConfig();
  return (
    <>
      {loading && <CircularProgress />}
      {error && <ErrorMessage message="Error fetching config" />}
      {config && <MainView config={config} />}
    </>
  );
};

const App = () => {
  return (
    <div>
      <CssBaseline />
      <AppBar position="static" style={{ position: 'relative', paddingLeft: '8%' }}>
        <Toolbar>
          <LogoIcon />
          <Typography variant="h5" color="inherit" noWrap style={{ paddingLeft: '15px' }}>
            GraphQL Turtle - Authorization config
          </Typography>
        </Toolbar>
      </AppBar>
      <Router>
        <MainView path="/" />
        <MainView path="/create" />
        <MainViewInEditMode path="/edit" />
      </Router>
    </div>
  );
};

export default hot(module)(App);
