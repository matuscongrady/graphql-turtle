import { CHECK_URL } from '@/contants';
import { ErrorMessage } from '@components/_reusable/ErrorMessage';
import { Button, Grid, Paper, SnackbarContent, TextField } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import SendIcon from '@material-ui/icons/Send';
import * as React from 'react';

export default ({  }: RuleUserProps) => {
  const [query, setQuery] = React.useState('');
  const [requestor, setRequetor] = React.useState('');
  const [response, setResponse] = React.useState('');
  const [error, setError] = React.useState<string>(null);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  function handleQueryChange(e) {
    setQuery(e.target.value);
    setError(null);
    setResponse(null);
  }

  function handleRequestorChange(e) {
    setRequetor(e.target.value);
    try {
      setError(null);
      setResponse(null);
      JSON.parse(e.target.value);
    } catch (e) {
      setError('Requestor must be a valid JSON object');
    }
  }

  function testQuery() {
    setLoading(true);
    setError(null);
    fetch(CHECK_URL, {
      method: 'POST',
      body: JSON.stringify({ query, requestor }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(res => {
        setLoading(false);
        if (res.error) {
          return setError(res.message);
        }
        setResponse(res);
      })
      .catch(() => {
        setLoading(false);
        setError('Network error');
      });
  }

  return (
    <div>
      {error && <ErrorMessage message={error} />}
      {response && (
        <SnackbarContent
          style={{ marginBottom: '10px', backgroundColor: '#32c553', width: '100%' }}
          message={
            <span style={{ alignItems: 'center', display: 'flex' }}>
              <DoneIcon />
              &nbsp;&nbsp;Pass
            </span>
          }
        />
      )}
      <Paper style={{ marginTop: error || response ? '22px' : '110px' }}>
        <Grid spacing={24} justify="center" container direction="row">
          <Grid item style={{ width: '48%', marginLeft: '2%', marginTop: '12px', padding: '0px 12px 8px 12px' }}>
            <TextField
              label="Query"
              placeholder="Enter your graphql query..."
              multiline={true}
              value={query}
              fullWidth
              onChange={handleQueryChange}
              rows={18}
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
          </Grid>
          <Grid item style={{ width: '48%', marginRight: '2%', marginTop: '12px', padding: '0px 12px 8px 12px' }}>
            <TextField
              label="Requestor object"
              placeholder="Enter your requestor json object..."
              multiline={true}
              value={requestor}
              onChange={handleRequestorChange}
              fullWidth
              rows={18}
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              autoFocus
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          disabled={isLoading || !!error || !query || !requestor}
          style={{ marginTop: '20px', float: 'right' }}
          onClick={testQuery}
          color="primary"
        >
          <SendIcon />
          &nbsp;&nbsp; Test
        </Button>
      </Paper>
    </div>
  );
};
