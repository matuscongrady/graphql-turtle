import { Button } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import * as React from 'react';

export default props => {
  return (
    <Button
      style={{ height: props.height || '28px' }}
      onClick={e => {
        e.stopPropagation();
      }}
      variant="extendedFab"
      aria-label="Add"
    >
      <AddIcon />
      &nbsp;{props.text}
    </Button>
  );
};
