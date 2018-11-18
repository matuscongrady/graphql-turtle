import { ACTIVE_RULES_LOCALSTORAGE_KEY, AVAILABLE_RULES_LOCALSTORAGE_KEY } from '@/contants';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
  MenuItem,
  Select
} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import LayersIcon from '@material-ui/icons/Layers';
import * as React from 'react';
import { useBoolean } from 'react-hanger';
import { useLocalStorage } from 'react-use';

interface AddRuleButtonProps {
  height: number;
  text: string;
  fieldName: string;
  parentType: string;
}

export default ({ height, text, fieldName, parentType }: AddRuleButtonProps) => {
  const uniqueTypeKey = `${parentType}_${fieldName}`;
  const { setTrue: openDialog, setFalse: closeDialog, value: isDialogOpen } = useBoolean(false);
  const [localStorageAvailableRules] = useLocalStorage(AVAILABLE_RULES_LOCALSTORAGE_KEY, []);
  const [localStorageActiveRules, setLocalStorageActiveRules] = useLocalStorage(ACTIVE_RULES_LOCALSTORAGE_KEY, {});
  const activeRules: string[] = localStorageActiveRules[uniqueTypeKey] || [];
  const availableRules: AvailableRule[] = localStorageAvailableRules.filter(
    (rule: AvailableRule) => !activeRules.find(activeRule => activeRule === rule.name)
  );

  function addRule(e) {
    localStorageActiveRules[uniqueTypeKey] = activeRules.concat(e.target.value);
    setLocalStorageActiveRules(localStorageActiveRules);
  }
  const removeRule = (ruleName: string) => () => {
    localStorageActiveRules[uniqueTypeKey] = activeRules.filter(rule => rule !== ruleName);
    setLocalStorageActiveRules(localStorageActiveRules);
  };

  return (
    <>
      <Dialog open={isDialogOpen} onClose={closeDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Set rules for rule <b>{fieldName}</b> on type <b>{parentType}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>You can attach any custom rule from rule-manager.</DialogContentText>
          <List dense>
            {activeRules.map(rule => (
              <ListItem key={rule}>
                <Avatar>
                  <LayersIcon />
                </Avatar>
                <ListItemText primary={rule} />
                <ListItemSecondaryAction>
                  <IconButton onClick={removeRule(rule)} aria-label="Delete">
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
          <FormControl fullWidth>
            <InputLabel>Attach rule ({availableRules.length} available)</InputLabel>
            <Select disabled={availableRules.length === 0} displayEmpty value="" onChange={addRule}>
              {availableRules.map(rule => (
                <MenuItem key={rule.name} value={rule.name}>
                  {rule.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions style={{ padding: '5px' }}>
          <Button onClick={closeDialog} color="primary">
            Close
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
