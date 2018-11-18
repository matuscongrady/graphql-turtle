import { Button } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import * as React from 'react';
import JSONInput from 'react-json-editor-ajrm/es';
import en from 'react-json-editor-ajrm/locale/en';

export default () => {
  const [config, setConfig] = React.useState('');

  return (
    <div>
      <JSONInput height="450px" locale={en} width="100%" waitAfterKeyPress={250} />
      <Button variant="contained" color="primary">
        <SaveIcon />
        &nbsp;&nbsp; Import
      </Button>
    </div>
  );
};
