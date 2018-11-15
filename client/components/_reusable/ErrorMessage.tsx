import { SnackbarContent } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import * as React from 'react';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <SnackbarContent
      style={{ marginBottom: '10px', backgroundColor: '#d32f2f' }}
      message={
        <span style={{ alignItems: 'center', display: 'flex' }}>
          <ErrorIcon />
          &nbsp;&nbsp;{message}
        </span>
      }
    />
  );
}
