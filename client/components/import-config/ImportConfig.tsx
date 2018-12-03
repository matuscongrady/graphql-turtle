import { ErrorMessage } from '@components/_reusable/ErrorMessage';
import { Button, Paper } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import * as React from 'react';
import MonacoEditor from 'react-monaco-editor';

interface ImportConfigProps extends RuleUserProps {
  setURL(url: string): void;
}

export default ({ setAllActiveRulesMap, setAllAvailableRules, setURL }: ImportConfigProps) => {
  const [config, setConfig] = React.useState('');
  const [errors, setErrors] = React.useState([]);

  function handleConfigChange(stringConfig) {
    let cfg;
    try {
      cfg = JSON.parse(stringConfig);
    } catch (e) {
      setErrors(['Invalid JSON']);
      setConfig(stringConfig);
      return;
    }
    const validationErrors = [];
    if (typeof cfg.endpointURL !== 'string' || !cfg.endpointURL) {
      validationErrors.push('endpointURL must be a non-empty string');
    }
    if (typeof cfg.activeRules !== 'object' || Array.isArray(cfg.activeRules)) {
      validationErrors.push('activeRules must be an object');
    }
    if (!Array.isArray(cfg.availableRules)) {
      validationErrors.push('available rules must be an array');
    }
    setErrors(validationErrors);
    setConfig(stringConfig);
  }

  function handleImportConfig() {
    try {
      const parsedConfig = JSON.parse(config);
      setAllActiveRulesMap(parsedConfig.activeRules);
      setAllAvailableRules(parsedConfig.availableRules);
      setURL(parsedConfig.endpointURL);
    } catch (e) {
      setErrors(['Error occured while importing config']);
    }
  }

  const isAbleToImport = Boolean(config && !errors.length);

  return (
    <div>
      <Paper style={{ maxHeight: '580px', padding: '10px 14px 6px 0px' }}>
        <MonacoEditor
          height="420"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            formatOnPaste: true,
            occurrencesHighlight: false,
            scrollBeyondLastColumn: 0,
            scrollBeyondLastLine: false
          }}
          language="json"
          theme="vs"
          value={config}
          onChange={handleConfigChange}
        />
      </Paper>
      {config && errors.length > 0 && (
        <ErrorMessage style={{ marginTop: '11px', marginBottom: '0px' }} message={errors[0]} />
      )}
      <Button
        variant="contained"
        style={{ marginTop: '11px', float: 'right' }}
        onClick={handleImportConfig}
        color="primary"
        disabled={!isAbleToImport}
      >
        <SaveIcon />
        &nbsp;&nbsp; Import
      </Button>
    </div>
  );
};
