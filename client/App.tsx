import { useConfig } from '@/utils/data-fetching';
import { ErrorMessage } from '@components/_reusable/ErrorMessage';
import MainView from '@components/MainView';
import SaveChanges from '@components/save-changes/SaveChanges';
import { AppBar, CircularProgress, CssBaseline, Toolbar, Typography } from '@material-ui/core';
import LogoIcon from '@material-ui/icons/dns';
import { Router } from '@reach/router';
import * as React from 'react';
import { hot, setConfig as setHotLoaderConfig } from 'react-hot-loader';

setHotLoaderConfig({ pureSFC: true } as any);

const MainViewWithConfigPrefetch = ({ isViewOnlyMode }: any) => {
  const { loading, error, config } = useConfig();
  return (
    <>
      {loading && <CircularProgress />}
      {error && <ErrorMessage message="Error fetching config" />}
      {config && <MainView isViewOnlyMode={isViewOnlyMode || false} config={config} />}
    </>
  );
};

const App = () => {
  return (
    <div>
      <CssBaseline />
      <AppBar position="static" style={{ position: 'relative', paddingLeft: '9%', paddingRight: '9%' }}>
        <Toolbar>
          <LogoIcon />
          <Typography variant="h5" color="inherit" noWrap style={{ paddingLeft: '15px' }}>
            GraphQL Turtle - Authorization config
          </Typography>
          {location.pathname.includes('edit') && <SaveChanges />}
        </Toolbar>
      </AppBar>
      <Router>
        <MainViewWithConfigPrefetch isViewOnlyMode path="/" />
        <MainView isViewOnlyMode={false} path="/create" />
        <MainViewWithConfigPrefetch path="/edit" />
      </Router>
    </div>
  );
};

export default hot(module)(App);
