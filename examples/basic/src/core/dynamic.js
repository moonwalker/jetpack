import React, { Component } from 'react';
import importCss from './import-css';

export default function ({ chunkName, clientLoad, serverLoad, loading }) {

  const isServer = typeof window === 'undefined';
  const weakId = (isServer && typeof serverLoad === 'function') ? serverLoad() : null;

  const Dynamic = class extends Component {
    constructor(...args) {
      super(...args);

      this.LoadingComponent = loading ? loading : (<p>loading...</p>);
      this.state = { AsyncComponent: null };

      if (isServer) {
        this.loadComponent();
      }
    }

    loadComponent() {
      const load = (m) => {
        const AsyncComponent = m.default || m;

        if (this.mounted) {
          this.setState({ AsyncComponent });
        } else {
          this.state.AsyncComponent = AsyncComponent;
        }
      }

      if (weakId && __webpack_modules__[weakId]) {
        load(__webpack_require__(weakId));
      } else {
        Promise.all([
          importCss(chunkName),
          clientLoad(this.props)
        ]).then(([css, mod]) => load(mod));
      }
    }

    componentDidMount() {
      this.mounted = true;
      if (!isServer) {
        this.loadComponent();
      }
    }

    render() {
      const { AsyncComponent } = this.state;
      const { LoadingComponent } = this;

      return AsyncComponent
        ? (<AsyncComponent {...this.props} />)
        : (<LoadingComponent {...this.props} />);
    }
  }

  Dynamic.chunkName = chunkName;

  return Dynamic;
}
