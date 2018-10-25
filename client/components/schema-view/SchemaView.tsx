import { Alert, Button, Icon, Input } from 'antd';
import { HttpLink } from 'apollo-link-http';
import { introspectSchema } from 'graphql-tools';
import * as React from 'react';
import { store, view } from 'react-easy-state';
import ReactJson from 'react-json-view';

const localStore = store({
  url: localStorage.getItem('schema-url') || 'my-graphql-api-uri',
  isLoading: false,
  fetchingError: false,
  schema: null,
  setURL(event) {
    const schemaURL: string = event.target.value;
    localStore.url = schemaURL;
    localStorage.setItem('schema-url', schemaURL);
  },
  downloadSchema() {
    localStore.isLoading = true;
    introspectSchema(new HttpLink({ uri: localStore.url, fetch: window.fetch }))
      .then(schema => {
        localStore.schema = schema;
        localStore.isLoading = false;
      })
      .catch(err => {
        console.error(err);
        localStore.isLoading = false;
        localStore.fetchingError = true;
      });
  }
});

export default view(() => {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        {localStore.fetchingError && (
          <Alert
            style={{ margin: '15px' }}
            message="Couldn't fetch schema introspection."
            showIcon
            type="error"
            closable
          />
        )}
        <Input
          value={localStore.url}
          onChange={localStore.setURL}
          addonBefore={<Icon type="deployment-unit" theme="outlined" />}
        />
        <p>
          You can use <u>https://api.graph.cool/simple/v1/cj7j2myai03tg0194pj6cjr5d</u>
        </p>
        <Button
          loading={localStore.isLoading}
          style={{ marginTop: '10px', float: 'right' }}
          type="primary"
          size="large"
          onClick={localStore.downloadSchema}
          icon="download"
        >
          Save schema
        </Button>
        <div>{localStore.schema && <ReactJson src={JSON.parse(JSON.stringify(localStore.schema))} />}</div>
      </div>
    </div>
  );
});
