e
export interface IAppConfig {
  ENV: String,
  NAMESPACE: String,
  RELEASE: String,
  API_HOST: String,
  TRACK_HOST: String
}

declare const APP_CONFIG: IAppConfig;
