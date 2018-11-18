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

const isValidJavascriptCode = (code: string): boolean => {
  try {
    eval(code);
  } catch (e) {
    if (e instanceof SyntaxError) return false;
    return true;
  }
};

export default () => {
  const { setTrue: openDialog, setFalse: closeDialog, value: isDialogOpen } = useBoolean(false);
  const [ruleName, setRuleName] = React.useState('');
  const [ruleDefinition, setRuleDefinition] = React.useState('');
  const [rules, saveRules] = useLocalStorage(SAVED_RULES_LOCALSTORAGE_KEY, '');
  const savedRules = JSON.parse(rules || '[]');

  function createNewRule() {
    savedRules.push({ ruleDefinition, name: ruleName });
    saveRules(JSON.stringify(savedRules));
    closeDialog();
  }

  const isValidCode = isValidJavascriptCode(ruleDefinition);

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
        {savedRules.map(rule => (
          <ExpansionPanel key={rule.name}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{rule.name}</Typography>
            </ExpansionPanelSummary>
            <Divider />
            <ExpansionPanelDetails>
              <SyntaxHighlighter language="javascript" style={prism}>
                {rule.ruleDefinition}
              </SyntaxHighlighter>
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
              Rule definition - must be a valid ES6 javascript syntax
            </Typography>
            <TextField
              autoFocus
              error={!isValidCode}
              value={ruleDefinition}
              margin="dense"
              label="Rule definition"
              type="string"
              fullWidth
              onChange={e => setRuleDefinition(e.target.value)}
            />
          </div>
        </DialogContent>
        <DialogActions style={{ padding: '5px' }}>
          <Button onClick={closeDialog} color="primary">
            Cancel
          </Button>
          <Button disabled={!ruleName || !isValidCode} onClick={createNewRule} variant="contained" color="primary">
            Create rule
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
