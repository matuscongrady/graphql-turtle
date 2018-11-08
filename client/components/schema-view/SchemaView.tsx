import { Button, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/SaveAlt';
import IntrospectionQuery from '@queries/introspection.graphql';
import { getQueryFields, QueryField } from '@utils/schema-introspection';
import { request } from 'graphql-request';
import * as React from 'react';
import { useLocalStorage } from 'react-use';
import { isURL } from 'validator';

const getURL = (url: string) => (url.startsWith('http') ? url : `https://${url}`);

const LOCALSTORAGE_SCHEMA_KEY = 'SCHEMA_URL';
const LOCALSTORAGE_INTROSPECTION_KEY = 'INTROSPECTION_URL';

export default () => {
  const [url, setURL] = useLocalStorage(LOCALSTORAGE_SCHEMA_KEY, '');
  const [schemaIntrospection, setSchemaIntrospection] = useLocalStorage(LOCALSTORAGE_INTROSPECTION_KEY, '');
  const [error, setError] = React.useState<boolean>(null);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  function handleURLChange({ target: { value } }) {
    setURL(value);
  }

  const queryFields: QueryField[] = JSON.parse(schemaIntrospection);

  function downloadSchema() {
    setLoading(true);
    return request(getURL(url), IntrospectionQuery)
      .then((res: SchemaIntrospection) => {
        setSchemaIntrospection(JSON.stringify(getQueryFields(res)));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err);
        setLoading(false);
      });
  }
  return (
    <div>
      <TextField id="outlined-name" label="Name" value={url} fullWidth onChange={handleURLChange} margin="normal" />
      <Button disabled={!isURL(getURL(url))} onClick={downloadSchema} variant="contained" color="primary">
        <SaveIcon />
        &nbsp; Download introspection
      </Button>
      <p>
        You can use:
        <br />
        <u>api.graph.cool/simple/v1/cj7j2myai03tg0194pj6cjr5d</u>
      </p>
      {error && 'error'}
      {isLoading && 'loading...'}
      {schemaIntrospection &&
        queryFields.map(field => (
          <div>
            <span>{field.name} -> </span>
            <span>{field.type}</span>
            {field.isList && <span>[]</span>}
          </div>
        ))}
    </div>
  );
};
