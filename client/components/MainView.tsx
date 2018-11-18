import RuleManager from '@components/rule-manager/RuleManager';
import TypeExplorer from '@components/schema-view/TypeExplorer';
import { AppBar, Button, CircularProgress, Tab, Tabs, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/SaveAlt';
import IntrospectionQuery from '@queries/introspection.graphql';
import { ErrorMessage } from '@reusable/ErrorMessage';
import { getFieldsForType, getTypes } from '@utils/schema-introspection';
import { request } from 'graphql-request';
import * as React from 'react';
import { useCounter, useLocalStorage } from 'react-use';
import { isURL } from 'validator';

enum RootParentType {
  QUERY = 'Query',
  MUTATION = 'Mutation',
  TYPE = 'Type'
}

const getURL = (url: string) => (url.startsWith('http') ? url : `https://${url}`);

const LOCALSTORAGE_SCHEMA_URL_KEY = 'SCHEMA_URL';

interface ParsedSchemaIntrospection {
  queries?: any;
  mutations?: any;
  types?: any;
}

export default ({  }: { config?: any }) => {
  const [url, setURL] = useLocalStorage(LOCALSTORAGE_SCHEMA_URL_KEY, '');
  const [schemaIntrospection, setSchemaIntrospection] = React.useState<ParsedSchemaIntrospection>(null);
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
        setSchemaIntrospection({
          queries: getFieldsForType(res, 'Mutation'),
          mutations: getFieldsForType(res, 'Query'),
          types: getTypes(res)
        });
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
      {selectedViewIndex === 0 && !isLoading && schemaIntrospection && (
        <TypeExplorer parentType={RootParentType.QUERY} fields={schemaIntrospection.queries} />
      )}
      {selectedViewIndex === 1 && !isLoading && schemaIntrospection && (
        <TypeExplorer parentType={RootParentType.MUTATION} fields={schemaIntrospection.mutations} />
      )}
      {selectedViewIndex === 2 && !isLoading && schemaIntrospection && (
        <TypeExplorer parentType={RootParentType.TYPE} fields={schemaIntrospection.types} />
      )}
      {selectedViewIndex === 3 && <RuleManager />}
    </main>
  );
};
