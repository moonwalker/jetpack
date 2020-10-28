e
export interface IAppConfig {
  ENV: String,
  NAMESPACE: String,
  RELEASE: String,
  API_HOST: String,
  TRACK_HOST: String
}

declare const APP_CONFIG: IAppConfig;

// Env vars
declare namespace NodeJS {
  interface Process {
    readonly browser: boolean
  }

  interface ProcessEnv {
    readonly PRODUCT: string;
    readonly STORYBOOK: boolean;
    readonly SENTRY_CLIENT_DSN: string;
  }
}

// Styles/CSS -> CSS-Modules
declare module '*.styl' {
  const content: { [className: string]: string };
  export default content;
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}
