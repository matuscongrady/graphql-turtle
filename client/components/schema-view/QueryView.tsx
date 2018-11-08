import {
  Chip,
  Divider,
  ExpansionPanel,
  ExpansionPanelActions,
  ExpansionPanelDetails,
  ExpansionPanelSummary,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { QueryField } from '@utils/schema-introspection';
import * as React from 'react';
import AddRuleButton from './AddRuleButton';

const QueryFieldItem = ({ queryField }: { queryField: QueryField }) => {
  return (
    <>
      <ExpansionPanel key={queryField.name}>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="subheading">{queryField.name}</Typography>
        </ExpansionPanelSummary>
        <Divider />
        <ExpansionPanelDetails style={{ padding: '0px', display: 'initial' }}>
          <List>
            {queryField.fields.map(field => (
              <ListItem disableGutters key={field.name} style={{ padding: '3px 10px 3px 0px', color: 'white' }}>
                <ListItemText style={{ fontSize: '1rem', fontWeight: 'bold' }} inset primary={field.name} />
                {field.isNonNull && (
                  <Chip style={{ width: '80px' }} variant="outlined" color="secondary" label="Non Null" />
                )}
                <Chip style={{ width: '100px' }} variant="outlined" label={field.type} />
                <AddRuleButton text="Manage type rules" height="24px" />
              </ListItem>
            ))}
          </List>
        </ExpansionPanelDetails>
        <Divider />
        <ExpansionPanelActions>
          <AddRuleButton text="Manage query rules" height="24px" />
        </ExpansionPanelActions>
      </ExpansionPanel>
    </>
  );
};

export default ({ queryFields }: { queryFields: QueryField[] }) => {
  return (
    <div style={{ width: '100%', marginBottom: '25px' }}>
      {queryFields.map(queryField => (
        <QueryFieldItem key={queryField.name} queryField={queryField} />
      ))}
    </div>
  );
};
