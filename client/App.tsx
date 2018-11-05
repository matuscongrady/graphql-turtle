import Schema from '@components/schema-view/SchemaView';
import { AppBar, CssBaseline, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/Explore';
import * as React from 'react';
import { hot, setConfig } from 'react-hot-loader';
import SwipeableViews from 'react-swipeable-views';
import { useCounter } from 'react-use';

setConfig({ pureSFC: true } as any);

const App = () => {
  const [selectedViewIndex, { set }] = useCounter(0);

  function selecteView(_event, value) {
    set(value);
  }

  return (
    <>
      <CssBaseline />
      <AppBar position="static" style={{ position: 'relative', paddingLeft: '10%' }}>
        <Toolbar>
          <ExploreIcon />
          <Typography variant="h5" color="inherit" noWrap style={{ paddingLeft: '15px' }}>
            GraphQL Turtle
          </Typography>
        </Toolbar>
      </AppBar>
      <main style={{ width: '80%', margin: 'auto', paddingTop: '40px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Authorization config
        </Typography>
        <AppBar position="static" color="default">
          <Tabs value={selectedViewIndex} onChange={selecteView} indicatorColor="primary" textColor="primary" fullWidth>
            <Tab label="Schema" />
            <Tab label="Saved rules" />
          </Tabs>
        </AppBar>
        <SwipeableViews index={selectedViewIndex} onChangeIndex={set}>
          <Schema />
          <div>2</div>
        </SwipeableViews>
      </main>
    </>
  );
};

export default hot(module)(App);
