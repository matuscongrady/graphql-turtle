import { CHECK_URL, QUERY_LOCALSTORAGE_KEY, REQUESTOR_LOCALSTORAGE_KEY } from '@/contants';
import { ErrorMessage } from '@components/_reusable/ErrorMessage';
import { Button, Grid, Paper, SnackbarContent } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import SendIcon from '@material-ui/icons/Send';
import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';
import { useLocalStorage } from 'react-use';

export default ({  }: RuleUserProps) => {
  const [query, setQuery] = useLocalStorage(QUERY_LOCALSTORAGE_KEY, '');
  const [requestor, setRequetor] = useLocalStorage(REQUESTOR_LOCALSTORAGE_KEY, '');
  const [response, setResponse] = React.useState('');
  const [error, setError] = React.useState<string>(null);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const isSendDisabled = Boolean(isLoading || error || !query || !requestor);

  function handleQueryChange(value) {
    setQuery(value);
    setError(null);
    setResponse(null);
  }

  function handleRequestorChange(value) {
    setRequetor(value);
    try {
      setError(null);
      setResponse(null);
      JSON.parse(value);
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
        setError(null);
      })
      .catch(() => {
        setLoading(false);
        setResponse(null);
        setError('Network error');
      });
  }

  return (
    <div>
      <Grid spacing={8} justify="center" container direction="row">
        <Grid item style={{ width: '50%', marginTop: '4px' }}>
          <Paper style={{ maxHeight: '580px', padding: '10px 0px 4px 0px' }}>
            <MonacoEditor
              height="420"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'off',
                formatOnPaste: true,
                occurrencesHighlight: false,
                scrollBeyondLastColumn: 0,
                scrollBeyondLastLine: false
              }}
              language="text"
              theme="vs"
              value={query}
              onChange={handleQueryChange}
            />
          </Paper>
        </Grid>
        <Grid item style={{ width: '50%', marginTop: '4px' }}>
          <Paper style={{ maxHeight: '580px', padding: '10px 0px 4px 0px' }}>
            <MonacoEditor
              height="420"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                formatOnPaste: true,
                lineNumbers: 'off',
                occurrencesHighlight: false,
                scrollBeyondLastColumn: 0,
                scrollBeyondLastLine: false
              }}
              language="json"
              theme="vs"
              value={requestor}
              onChange={handleRequestorChange}
            />
          </Paper>
        </Grid>
      </Grid>
      <div style={{ margin: '12px 0px', width: '100%', height: '52px' }}>
        {error && <ErrorMessage message={error} />}
        {response && (
          <SnackbarContent
            style={{ backgroundColor: '#32c553', width: '100%', maxWidth: '100%' }}
            message={
              <span style={{ alignItems: 'center', display: 'flex' }}>
                <DoneIcon />
                &nbsp;&nbsp;Pass
              </span>
            }
          />
        )}
      </div>
      <Button
        variant="contained"
        disabled={isSendDisabled}
        style={{ float: 'right' }}
        onClick={testQuery}
        color="primary"
      >
        <SendIcon />
        &nbsp;&nbsp; Test
      </Button>
    </div>
  );
};
