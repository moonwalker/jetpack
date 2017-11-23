const common = {
  productName: 'dreamz',
  baseDomain: 'mw.zone',
  countryCookie: 'UserCountry',
  defaultMarket: 'SE',
  defaultLocale: 'en',
  defaultSiteSettingId: '35UnSWWbR6IuywWEKYKMUw',
  appStateKey: 'app',
  apolloStateKey: 'apl',
  webfonts: 'Roboto:400,700',
  segmentWriteKey: "MmMxX6y6VxGOJeP1qOKRa6q6Csinyhqo"
}

//Added due to limitations in url patterns when using ssl
//Pattern is ${productName}-api.mw.zone
//and        staging-${productName}-api.mw.zone

const apiPath = `${common.productName}-api.${common.baseDomain}`;

const envConfig = {
  development: {
    queryApiUrl: 'http://localhost:50050/graphql',
    subsApiUrl: 'ws://localhost:50050/subscriptions',
    authToken: 'cpl_token-dev'
  },
  devdocker: {
    queryApiUrl: 'http://localhost:8000/graphql',
    subsApiUrl: 'ws://localhost:8000/subscriptions',
    authToken: 'cpl_token-dev'
  },
  //staging: {
  //  queryApiUrl: `https://staging-${apiPath}/graphql`,
  //  subsApiUrl: `wss://staging-${apiPath}/subscriptions`,
  //  authToken: 'cpl_token-stg'
  //},
  staging: {
    queryApiUrl: `https://${apiPath}/graphql`,
    subsApiUrl: `wss://${apiPath}/subscriptions`,
    authToken: 'cpl_token'
  },
  production: {
    queryApiUrl: `https://${apiPath}/graphql`,
    subsApiUrl: `wss://${apiPath}/subscriptions`,
    authToken: 'cpl_token'
  }
}

const env = process.env.ENV || process.env.NODE_ENV || 'development';
module.exports = { ...common, ...envConfig[env] };
