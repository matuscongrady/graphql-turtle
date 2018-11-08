import RuleManager from '@components/rule-manager/RuleManager';
import Schema from '@components/schema-view/SchemaContainer';
import { AppBar, CssBaseline, Tab, Tabs, Toolbar, Typography } from '@material-ui/core';
import ExploreIcon from '@material-ui/icons/Explore';
import * as React from 'react';
import { hot, setConfig } from 'react-hot-loader';
import { useCounter } from 'react-use';

setConfig({ pureSFC: true } as any);

const App = () => {
  const [selectedViewIndex, { set }] = useCounter(0);

  function selecteView(_event, value) {
    set(value);
  }

  return (
    <div>
      <CssBaseline />
      <AppBar position="static" style={{ position: 'relative', paddingLeft: '13%' }}>
        <Toolbar>
          <ExploreIcon />
          <Typography variant="h5" color="inherit" noWrap style={{ paddingLeft: '15px' }}>
            GraphQL Turtle
          </Typography>
        </Toolbar>
      </AppBar>
      <main style={{ width: '70%', margin: 'auto', paddingTop: '20px' }}>
        <Typography variant="h5" align="center" gutterBottom>
          Authorization config
        </Typography>
        <AppBar style={{ marginBottom: '20px' }} position="static" color="default">
          <Tabs value={selectedViewIndex} onChange={selecteView} indicatorColor="primary" textColor="primary" fullWidth>
            <Tab label="Schema" />
            <Tab label="Rule manager" />
          </Tabs>
        </AppBar>
        {selectedViewIndex === 0 && <Schema key={1} />}
        {selectedViewIndex === 1 && <RuleManager key={2} />}
      </main>
    </div>
  );
};

export default hot(module)(App);
