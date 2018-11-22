import { CONFIG_URL } from '@/contants';
import * as React from 'react';

export const useConfig = () => {
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);
  const [config, setConfig] = React.useState(null);

  React.useEffect(() => {
    setError(false);
    fetch(CONFIG_URL)
      .then(res => res.json())
      .then(data => {
        setConfig(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setConfig(null);
        setError(err);
        setLoading(false);
      });
  }, []);
  return { loading, error, config };
};
