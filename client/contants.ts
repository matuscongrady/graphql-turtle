export const BASE_API_URL = process.env.NODE_END === 'production' ? '' : 'http://localhost:4000';
export const CONFIG_URL = `${BASE_API_URL}/turtle/config`;
export const CHECK_URL = `${BASE_API_URL}/turtle/check`;
export const AVAILABLE_RULES_LOCALSTORAGE_KEY = 'AVAILABLE_RULES';
export const ACTIVE_RULES_LOCALSTORAGE_KEY = 'ACTIVE_RULES';
export const SCHEMA_URL_LOCALSTORAGE_KEY = 'SCHEMA_URL';
export const REQUESTOR_LOCALSTORAGE_KEY = 'REQUESTOR';
export const QUERY_LOCALSTORAGE_KEY = 'QUERY';
