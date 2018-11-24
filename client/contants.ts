export const BASE_API_URL = process.env.NODE_END === 'production' ? '' : 'http://localhost:4000';
export const CONFIG_URL = `${BASE_API_URL}/turtle/config`;
export const CHECK_URL = `${BASE_API_URL}/turtle/check`;
export const AVAILABLE_RULES_LOCALSTORAGE_KEY = 'AVAILABLE_RULES_LOCALSTORAGE_KEY';
export const ACTIVE_RULES_LOCALSTORAGE_KEY = 'ACTIVE_RULES_LOCALSTORAGE_KEY';
export const LOCALSTORAGE_ENDPOINT_URL_KEY = 'SCHEMA_URL';
