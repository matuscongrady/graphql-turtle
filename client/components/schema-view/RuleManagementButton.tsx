import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import * as React from 'react';
import { useBoolean } from 'react-hanger';

interface AddRuleButtonProps {
  height: number;
  text: string;
  fieldName: string;
  parentType: string;
}

export default ({ height, text, fieldName, parentType }: AddRuleButtonProps) => {
  const { setTrue: openDialog, setFalse: closeDialog, value: isDialogOpen } = useBoolean(false);
  return (
    <>
      <Dialog open={isDialogOpen} onClose={closeDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Set rules for rule <b>{fieldName}</b> on type <b>{parentType}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can create custom authorization rules here. You can then attach them to your schema types.
          </DialogContentText>
        </DialogContent>
        <DialogActions style={{ padding: '5px' }}>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <Button
        style={{ height: `${height}px`, minHeight: `${height}px` }}
        onClick={e => {
          openDialog();
          e.stopPropagation();
        }}
        variant="extendedFab"
        aria-label="Add"
      >
        <EditIcon />
        &nbsp;{text}
      </Button>
    </>
  );
};
