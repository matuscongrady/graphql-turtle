import { getUniqueTypeFieldName } from '@/utils/parsing';
import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
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

interface AddRuleButtonProps extends RuleUserProps {
  height: number;
  text: string;
  fieldName: string;
  parentType: string;
}

export default ({
  height,
  text,
  fieldName,
  parentType,
  allAvailableRules,
  allActiveRulesMap,
  setAllActiveRulesMap
}: AddRuleButtonProps) => {
  const uniqueTypeFieldName = getUniqueTypeFieldName(parentType, fieldName);
  const { setTrue: openDialog, setFalse: closeDialog, value: isDialogOpen } = useBoolean(false);
  const activeRulesForField = allActiveRulesMap[uniqueTypeFieldName] || [];
  const availableRulesForField: AvailableRule[] = allAvailableRules.filter(r => !activeRulesForField.includes(r.name));

  function addRule(e) {
    setAllActiveRulesMap({ ...allActiveRulesMap, [uniqueTypeFieldName]: [...activeRulesForField, e.target.value] });
  }
  const removeRule = (ruleName: string) => () => {
    setAllActiveRulesMap({
      ...allActiveRulesMap,
      [uniqueTypeFieldName]: activeRulesForField.filter(rule => rule !== ruleName)
    });
  };

  const isAllRulesUsed = availableRulesForField.length === 0;

  return (
    <>
      <Dialog open={isDialogOpen} onClose={closeDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          Set rules for rule <b>{fieldName}</b> on type <b>{parentType}</b>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>You can attach any custom rule from rule-manager.</DialogContentText>
          <List dense>
            {activeRulesForField.map(rule => (
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
            <InputLabel>Attach rule ({availableRulesForField.length} available)</InputLabel>
            <Select disabled={isAllRulesUsed} displayEmpty value="" onChange={addRule}>
              {availableRulesForField.map(rule => (
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
      <Fab
        style={{ height: `${height}px`, minHeight: `${height}px` }}
        onClick={e => {
          openDialog();
          e.stopPropagation();
        }}
        aria-label="Add"
      >
        <EditIcon />
        &nbsp;{text}
      </Fab>
    </>
  );
};
