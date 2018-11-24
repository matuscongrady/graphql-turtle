import { SnackbarContent } from '@material-ui/core';
import ErrorIcon from '@material-ui/icons/Error';
import * as React from 'react';

export function ErrorMessage({ message }: { message: string }) {
  return (
    <SnackbarContent
      style={{
        marginBottom: '10px',
        backgroundColor: '#d32f2f',
        width: '100%',
        maxWidth: 'initial',
        padding: '2px 18px'
      }}
      message={
        <span style={{ alignItems: 'center', display: 'flex' }}>
          <ErrorIcon />
          &nbsp;&nbsp; <p>{message}</p>
        </span>
      }
    />
  );
}
