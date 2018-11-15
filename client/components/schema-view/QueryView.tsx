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
import { css } from 'emotion';
import * as React from 'react';
import { useBoolean } from 'react-hanger';
import AddRuleButton from './AddRuleButton';

const QueryFieldItem = ({ queryField }: { queryField: QueryField }) => {
  const count = 0;
  const { value: isExpanded, toggle } = useBoolean(false);
  return (
    <>
      <ExpansionPanel onChange={toggle} expanded={isExpanded} key={queryField.name}>
        <ExpansionPanelSummary
          classes={{
            content: css`
              margin: 0px;
            `
          }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="subtitle1">
            {queryField.name}&nbsp;&nbsp;
            <Chip style={{ height: '24px' }} label={`(${count} rules)`} />
            <Chip
              style={{ height: '24px' }}
              label={`${queryField.isList ? '[' : ''}${queryField.type}${queryField.isList ? ']' : ''}`}
            />
          </Typography>
        </ExpansionPanelSummary>
        <Divider />
        {isExpanded && (
          <div>
            <ExpansionPanelDetails style={{ padding: '0px', display: 'initial' }}>
              <List>
                {queryField.fields.map(field => (
                  <ListItem disableGutters key={field.name} style={{ padding: '3px 10px 3px 0px', color: 'white' }}>
                    <ListItemText primaryTypographyProps={{ variant: 'subtitle2' }} inset primary={field.name} />
                    {field.isNonNull && (
                      <Chip style={{ height: '24px', width: '80px' }} color="secondary" label="Non Null" />
                    )}
                    <Chip style={{ height: '24px', width: '100px' }} label={field.type} />
                  </ListItem>
                ))}
              </List>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <AddRuleButton text="Manage query rules" height="24px" />
            </ExpansionPanelActions>
          </div>
        )}
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
