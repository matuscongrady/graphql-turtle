import {
  ACTIVE_RULES_LOCALSTORAGE_KEY,
  AVAILABLE_RULES_LOCALSTORAGE_KEY,
  LOCALSTORAGE_ENDPOINT_URL_KEY
} from '@/contants';

export const isValidJavascriptCode = (code: string): boolean => {
  try {
    eval(code);
  } catch (e) {
    if (e instanceof SyntaxError) return false;
    return true;
  }
};

export const getURL = (url: string) => (url.startsWith('http') ? url : `https://${url}`);

export const getActiveRuleMap = (
  stringifiedValues
): {
  [parentType: string]: {
    [type: string]: ActiveRule[];
  };
} => JSON.parse(stringifiedValues || '{}');
export const getActiveRules = (parentType: string, type: string, stringifiedValues: string): ActiveRule[] => {
  const ruleMap = getActiveRuleMap(stringifiedValues);
  return ruleMap[parentType] ? ruleMap[parentType][type] || [] : [];
};

export const getExportDataURI = () => {
  return `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(getFullConfig(), null, 2))}`;
};

export const getFullConfig = (): TurtleConfig => {
  const endpointURL = localStorage.getItem(LOCALSTORAGE_ENDPOINT_URL_KEY);
  return {
    endpointURL: endpointURL ? JSON.parse(endpointURL) : '',
    availableRules: JSON.parse(localStorage.getItem(AVAILABLE_RULES_LOCALSTORAGE_KEY) || '[]'),
    activeRules: JSON.parse(localStorage.getItem(ACTIVE_RULES_LOCALSTORAGE_KEY || '{}'))
  };
};
export const getUniqueTypeFieldName = (parentType: string, field: string) => `${parentType}-${field}`;
export const parseUniqueTypeFieldName = (uniqueTypeFieldName: string) => {
  const [parentType, field] = uniqueTypeFieldName.split('-');
  return { parentType, field };
};
