import Header from '@components/navigation/Header';
import Home from '@pages/Home';
import { Layout } from 'antd';
import * as React from 'react';
import { view } from 'react-easy-state';
import { hot } from 'react-hot-loader';
import { Route, Switch, withRouter } from 'react-router-dom';

const App = () => {
  return (
    <Layout>
      <Header />
      <Layout.Content style={{ padding: '15px 80px', minHeight: 'calc(100vh - 64px)' }}>
        <Switch>
          <Route exact path="/" component={Home} />
        </Switch>
      </Layout.Content>
    </Layout>
  );
};

export default hot(module)(withRouter(view(App)));
