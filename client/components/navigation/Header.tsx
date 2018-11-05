import { Layout } from 'antd';
import * as React from 'react';

const Header = () => {
  return (
    <Layout.Header style={{ paddingLeft: '80px' }}>
      <h2 style={{ color: 'white' }}>Graphql turtle config manager</h2>
    </Layout.Header>
  );
};

export default Header;
