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
import { TypeField } from '@utils/schema-introspection';
import { css } from 'emotion';
import * as React from 'react';
import { useBoolean } from 'react-hanger';
import RuleManagementButton from './RuleManagementButton';

const TypeChip = ({ field, width }: { field: BaseTypeInfo; width?: number }) => {
  return (
    <Chip
      style={{ height: '24px', width: width ? `${width}px` : undefined }}
      label={`${field.isList ? '[' : ''}${field.type}${field.isList ? ']' : ''}`}
    />
  );
};

const FieldItem = ({ field, parentType }: { field: TypeField; parentType: string }) => {
  const count = 0;
  const { value: isExpanded, toggle } = useBoolean(false);
  return (
    <>
      <ExpansionPanel onChange={toggle} expanded={isExpanded} key={field.name}>
        <ExpansionPanelSummary
          classes={{
            content: css`
              margin: 0px;
            `
          }}
          expandIcon={<ExpandMoreIcon />}
        >
          <Typography variant="subtitle1">
            {field.name}&nbsp;&nbsp;
            <Chip style={{ height: '24px' }} label={`(${count} rules)`} />
            <TypeChip field={field} />
          </Typography>
        </ExpansionPanelSummary>
        <Divider />
        {isExpanded && (
          <div>
            <ExpansionPanelDetails style={{ padding: '0px', display: 'initial' }}>
              <List>
                {field.fields.map((nestedField: BaseTypeInfo) => (
                  <ListItem
                    disableGutters
                    key={nestedField.name}
                    style={{ padding: '3px 10px 3px 0px', color: 'white' }}
                  >
                    <ListItemText primaryTypographyProps={{ variant: 'subtitle2' }} inset primary={nestedField.name} />
                    {nestedField.isNonNull && (
                      <Chip style={{ height: '24px', width: '80px' }} color="secondary" label="Non Null" />
                    )}
                    <TypeChip field={nestedField} width={220} />
                    {parentType === 'TYPE' && (
                      <RuleManagementButton
                        parentType={nestedField.name}
                        fieldName={nestedField.name}
                        text="Manage rules"
                        height={26}
                      />
                    )}
                  </ListItem>
                ))}
              </List>
            </ExpansionPanelDetails>
            <Divider />
            <ExpansionPanelActions>
              <RuleManagementButton fieldName={field.name} parentType={parentType} text="Manage rules" height={36} />
            </ExpansionPanelActions>
          </div>
        )}
      </ExpansionPanel>
    </>
  );
};

export default ({ fields, parentType }: { fields: TypeField[]; parentType: RootParentType }) => {
  return (
    <div style={{ width: '100%', marginBottom: '25px' }}>
      {fields.map(field => (
        <FieldItem parentType={parentType} key={field.name} field={field} />
      ))}
    </div>
  );
};
