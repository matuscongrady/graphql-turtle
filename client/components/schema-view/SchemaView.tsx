import { Button, TextField } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/SaveAlt';
import IntrospectionQuery from '@queries/introspection.graphql';
import { request } from 'graphql-request';
import * as React from 'react';
import ReactJson from 'react-json-view';
import { useLocalStorage } from 'react-use';

export default () => {
  const [url, setURL] = useLocalStorage('scema-url', '');
  const [schemaIntrospection, setSchemaIntrospection] = useLocalStorage('scema-introspection', '');
  const [error, setError] = React.useState(null);
  const [isLoading, setLoading] = React.useState(false);

  function downloadSchema() {
    setLoading(true);
    request(url, IntrospectionQuery)
      .then(res => {
        setSchemaIntrospection(JSON.stringify(res));
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
      <TextField
        id="outlined-name"
        label="Name"
        value={url}
        fullWidth
        onChange={e => setURL(e.target.value)}
        margin="normal"
      />
      <Button onClick={downloadSchema} variant="contained" color="primary">
        <SaveIcon />
        &nbsp; Download introspection
      </Button>
      <p>
        You can use:<br />
        <u>https://api.graph.cool/simple/v1/cj7j2myai03tg0194pj6cjr5d</u>
      </p>
      {error && JSON.stringify(error)}
      {isLoading && 'loading...'}
      {schemaIntrospection && <ReactJson src={JSON.parse(schemaIntrospection)} /> }
    </div>
  );
};


