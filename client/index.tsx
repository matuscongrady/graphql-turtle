import * as React from 'react';
import { render } from 'react-dom';
import App from './App';
import { ACTIVE_RULES_LOCALSTORAGE_KEY, AVAILABLE_RULES_LOCALSTORAGE_KEY } from './contants';

if (!localStorage.getItem(AVAILABLE_RULES_LOCALSTORAGE_KEY)) {
  localStorage.setItem(AVAILABLE_RULES_LOCALSTORAGE_KEY, '[]');
}
if (!localStorage.getItem(ACTIVE_RULES_LOCALSTORAGE_KEY)) {
  localStorage.setItem(ACTIVE_RULES_LOCALSTORAGE_KEY, '{}');
}

render(<App />, document.getElementById('app'));
