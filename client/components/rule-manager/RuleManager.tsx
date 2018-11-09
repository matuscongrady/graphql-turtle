import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import * as React from 'react';
import { useBoolean } from 'react-hanger';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/styles/prism';
import { useLocalStorage } from 'react-use';

const SAVED_RULES_LOCALSTORAGE_KEY = 'SAVED_RULES';

export default () => {
  const { setTrue: openDialog, setFalse: closeDialog, value: isDialogOpen } = useBoolean(false);
  const [ruleName, setRuleName] = React.useState('');
  const [requestorProperty, setRequestorProperty] = React.useState('');
  const [operator, setOperator] = React.useState('==');
  const [value, setValue] = React.useState('');
  const [rules, saveRules] = useLocalStorage(SAVED_RULES_LOCALSTORAGE_KEY, '');
  const savedRules = JSON.parse(rules || '{}');

  function handleOperatorChange(e) {
    setOperator(e.target.value);
  }
  function createNewRule() {
    savedRules[ruleName] = { requestorProperty, operator, value };
    saveRules(JSON.stringify(savedRules));
    setOperator('==');
    setRequestorProperty('');
    setValue('');
    closeDialog();
  }

  return (
    <div>
      <Button
        onClick={e => {
          e.stopPropagation();
          openDialog();
        }}
        variant="contained"
        color="primary"
        aria-label="Add"
      >
        <AddIcon />
        &nbsp;Create new rule
      </Button>
      <div style={{ paddingTop: '15px' }}>
        {Object.keys(savedRules).map(rn => (
          <ExpansionPanel key={rn}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{rn}</Typography>
            </ExpansionPanelSummary>
            <Divider />
            <ExpansionPanelDetails>
              <SyntaxHighlighter language="javascript" style={prism}>{`${savedRules[rn].requestorProperty} ${
                savedRules[rn].operator
              } ${savedRules[rn].value}`}</SyntaxHighlighter>
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button variant="fab" color="primary" aria-label="Add">
                <EditIcon />
              </Button>
              <Button variant="fab" color="secondary" aria-label="Edit">
                <DeleteIcon />
              </Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
      </div>
      <Dialog open={isDialogOpen} onClose={closeDialog} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create new rule</DialogTitle>
        <DialogContent>
          <DialogContentText>
            You can create custom authorization rules here. You can then attach them to your schema types.
          </DialogContentText>
          <TextField
            autoFocus
            value={ruleName}
            margin="dense"
            id="name"
            label="Rule name"
            type="string"
            fullWidth
            onChange={e => setRuleName(e.target.value)}
          />
          <div style={{ marginTop: '25px' }}>
            <Typography variant="h6" color="inherit" noWrap>
              Rule definition
            </Typography>
            <TextField
              autoFocus
              value={requestorProperty}
              margin="dense"
              id="requestor-property"
              label="Requestor object property"
              type="string"
              fullWidth
              onChange={e => setRequestorProperty(e.target.value)}
            />
            <Select style={{ marginTop: '15px' }} value={operator} onChange={handleOperatorChange}>
              <MenuItem value=">">{'>'}</MenuItem>
              <MenuItem value="<">{'<'}</MenuItem>
              <MenuItem value=">=">{'>='}</MenuItem>
              <MenuItem value="<=">{'<='}</MenuItem>
              <MenuItem value="==">{'=='}</MenuItem>
              <MenuItem value="!==">{'!=='}</MenuItem>
            </Select>
            <TextField
              value={value}
              onChange={e => setValue(e.target.value)}
              autoFocus
              margin="dense"
              id="value"
              label="Value"
              type="string"
              fullWidth
            />
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '5px' }}>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button
            disabled={!requestorProperty || !ruleName || !value}
            onClick={createNewRule}
            variant="contained"
            color="primary"
          >
            Create rule
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
