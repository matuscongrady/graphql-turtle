import RuleManager from '@components/rule-manager/RuleManager';
import { AppBar, Button, CircularProgress, Tab, Tabs, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/SaveAlt';
import IntrospectionQuery from '@queries/introspection.graphql';
import { ErrorMessage } from '@reusable/ErrorMessage';
import { getMutationFields, getQueryFields } from '@utils/schema-introspection';
import { request } from 'graphql-request';
import * as React from 'react';
import { useCounter, useLocalStorage } from 'react-use';
import { isURL } from 'validator';
import QueryView from './schema-view/QueryView';

const getURL = (url: string) => (url.startsWith('http') ? url : `https://${url}`);

const LOCALSTORAGE_SCHEMA_URL_KEY = 'SCHEMA_URL';

interface ParsedSchemaIntrospection {
  queryFields?: any;
  mutationFields?: any;
}

export default ({ config }: { config?: any }) => {
  console.log(config);
  const [url, setURL] = useLocalStorage(LOCALSTORAGE_SCHEMA_URL_KEY, '');
  const [schemaIntrospection, setSchemaIntrospection] = React.useState<ParsedSchemaIntrospection>({});
  const [error, setError] = React.useState<boolean>(false);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [selectedViewIndex, { set }] = useCounter(0);

  function selecteView(_event, value) {
    set(value);
  }
  function handleURLChange({ target: { value } }) {
    setURL(value);
  }

  function downloadSchema() {
    setLoading(true);
    setError(false);
    return request(getURL(url), IntrospectionQuery)
      .then((res: SchemaIntrospection) => {
        setSchemaIntrospection({ queryFields: getQueryFields(res), mutationFields: getMutationFields(res) });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setSchemaIntrospection({});
        setError(err);
        setLoading(false);
      });
  }

  return (
    <main style={{ width: '70%', margin: 'auto', paddingTop: '20px' }}>
      <TextField
        id="outlined-name"
        label="Schema URL"
        value={url}
        fullWidth
        onChange={handleURLChange}
        margin="normal"
      />
      <Button disabled={!isURL(getURL(url))} onClick={downloadSchema} variant="contained" color="primary">
        <SaveIcon />
        &nbsp; Download introspection
      </Button>
      <p>
        You can use:
        <br />
        <u>api.graph.cool/simple/v1/cj7j2myai03tg0194pj6cjr5d</u>
      </p>
      <AppBar style={{ marginBottom: '20px' }} position="static" color="default">
        <Tabs value={selectedViewIndex} onChange={selecteView} indicatorColor="primary" textColor="primary" fullWidth>
          <Tab label="Query rules" />
          <Tab label="Mutation rules" />
          <Tab label="Per-Type rules" />
          <Tab label="Rule manager" />
        </Tabs>
      </AppBar>
      {error && <ErrorMessage message="Error fetching schema!" />}
      {isLoading && <CircularProgress />}
      {selectedViewIndex === 0 && schemaIntrospection.queryFields && !isLoading && (
        <QueryView queryFields={schemaIntrospection.queryFields} />
      )}
      {selectedViewIndex === 1 && schemaIntrospection.mutationFields && !isLoading && (
        <QueryView queryFields={schemaIntrospection.mutationFields} />
      )}
      {selectedViewIndex === 2 && schemaIntrospection && !isLoading && <div>Type view</div>}
      {selectedViewIndex === 3 && <RuleManager key={4} />}
    </main>
  );
};
