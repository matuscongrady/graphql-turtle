import { Button, CircularProgress, SnackbarContent, TextField } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import SaveIcon from '@material-ui/icons/SaveAlt';
import IntrospectionQuery from '@queries/introspection.graphql';
import { getQueryFields } from '@utils/schema-introspection';
import { request } from 'graphql-request';
import * as React from 'react';
import { useLocalStorage } from 'react-use';
import { isURL } from 'validator';
import QueryView from './QueryView';

const getURL = (url: string) => (url.startsWith('http') ? url : `https://${url}`);

const LOCALSTORAGE_SCHEMA_URL_KEY = 'SCHEMA_URL';
const LOCALSTORAGE_INTROSPECTION_KEY = 'SCHEMA_INTROSPECTION';

export default () => {
  const [url, setURL] = useLocalStorage(LOCALSTORAGE_SCHEMA_URL_KEY, '');
  const [schemaIntrospection, setSchemaIntrospection] = useLocalStorage(LOCALSTORAGE_INTROSPECTION_KEY, '');
  const [error, setError] = React.useState<boolean>(null);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  function handleURLChange({ target: { value } }) {
    setURL(value);
  }

  function downloadSchema() {
    setLoading(true);
    setError(false);
    return request(getURL(url), IntrospectionQuery)
      .then((res: SchemaIntrospection) => {
        setSchemaIntrospection(JSON.stringify(getQueryFields(res)));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setSchemaIntrospection('');
        setError(err);
        setLoading(false);
      });
  }
  return (
    <div>
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
      {error && (
        <SnackbarContent
          style={{ marginBottom: '10px', backgroundColor: '#d32f2f' }}
          message={
            <span style={{ alignItems: 'center', display: 'flex' }}>
              <ErrorIcon />
              &nbsp;&nbsp;Error fetching schema!
            </span>
          }
        />
      )}
      {isLoading && <CircularProgress />}
      {schemaIntrospection && !isLoading && <QueryView queryFields={JSON.parse(schemaIntrospection)} />}
    </div>
  );
};
