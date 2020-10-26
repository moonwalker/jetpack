export interface IAppConfig {
  ENV: String,
  NAMESPACE: String,
  RELEASE: String,
  API_HOST: String,
  TRACK_HOST: String
}

declare const __CLIENT__: Boolean;
declare const __SERVER__: Boolean;
declare const __STORYBOOK__: Boolean;
declare const __SENTRY_CLIENT_DSN__: String;
declare const __PRODUCT_NAME__: String;
declare const APP_CONFIG: IAppConfig;
