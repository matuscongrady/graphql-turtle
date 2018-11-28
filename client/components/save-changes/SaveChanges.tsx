import { CONFIG_URL } from '@/contants';
import { getFullConfig } from '@/utils/parsing';
import { ErrorMessage } from '@components/_reusable/ErrorMessage';
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@material-ui/core';
import * as React from 'react';
import { useBoolean } from 'react-hanger';

export default () => {
  const { setTrue: openDialog, setFalse: closeDialog, value: isDialogOpen } = useBoolean(false);
  const [accessToken, setAccessToken] = React.useState('');
  const [error, setError] = React.useState<string>(null);
  const [isLoading, setLoading] = React.useState<boolean>(false);

  function save() {
    const config = getFullConfig();
    setLoading(true);
    setError(null);
    fetch(CONFIG_URL, {
      method: 'POST',
      body: JSON.stringify({ ...config, token: accessToken }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(res => res.json())
      .then(err => {
        setLoading(false);
        if (err.message === 'SUCCESS') {
          setAccessToken('');
          closeDialog();
        } else if (err.message === 'UNAUTHORIZED') {
          setError('Not authorized');
          closeDialog();
        } else {
          setError('Error saving config');
        }
      });
  }
  function handleAccessTokenChange(e) {
    setError(null);
    setAccessToken(e.target.value);
  }

  return (
    <>
      <Dialog open={isDialogOpen} onClose={closeDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Update your graphql-turtle config</DialogTitle>
        <DialogContent>
          {error && <ErrorMessage message={error} />}
          {isLoading && <CircularProgress />}
          <DialogContentText>Enter your access token</DialogContentText>
          <TextField
            style={{ marginTop: '18px' }}
            inputProps={{ type: 'password' }}
            value={accessToken}
            disabled={isLoading}
            onChange={handleAccessTokenChange}
            fullWidth
            autoFocus
          />
        </DialogContent>
        <DialogActions style={{ padding: '5px' }}>
          <Button onClick={closeDialog} color="primary">
            Close
          </Button>
          <Button disabled={!accessToken} onClick={save} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        onClick={openDialog}
        style={{ marginLeft: 'auto', color: 'white', borderColor: 'white' }}
        variant="outlined"
        color="default"
        aria-label="Add"
        disabled={isLoading}
      >
        &nbsp;Save changes
      </Button>
    </>
  );
};
