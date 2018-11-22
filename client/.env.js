module.exports = {
  NODE_ENV: JSON.stringify(process.env.NODE_ENV),
  APP_ENV: process.env.APP_ENV || 'dev',
  DEFAULT_LOCALE: process.env.DEFAULT_LOCALE || 'en',
  IS_CREATE_MODE: true,
  API_ENDPOINT: process.env.APP_ENV === 'prod' ? '' : 'http://localhost:4000'
};
