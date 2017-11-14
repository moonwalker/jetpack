const isServer = typeof window === 'undefined';

export default (chunkName) => {
  if (isServer || !window.__CSS_CHUNKS__) {
    return Promise.resolve();
  } else if (!(chunkName in window.__CSS_CHUNKS__)) {
    return Promise.reject(`chunk not found: ${chunkName}`);
  } else if (!window.__CSS_CHUNKS__[chunkName].css) {
    return Promise.resolve(`chunk css does not exist: ${chunkName}`);
  } else if (document.getElementById(`${chunkName}.css`)) {
    return Promise.resolve(`css chunk already loaded: ${chunkName}`);
  }

  const head = document.getElementsByTagName('head')[0];
  const link = document.createElement('link');
  link.href = window.__CSS_CHUNKS__[chunkName].css;
  link.id = `${chunkName}.css`;
  link.rel = 'stylesheet';

  return new Promise((resolve, reject) => {
    let timeout;

    link.onload = () => {
      link.onload = null;
      link.onerror = null;
      clearTimeout(timeout);
      resolve(`css chunk loaded: ${chunkName}`);
    };

    link.onerror = () => {
      link.onload = null;
      link.onerror = null;
      clearTimeout(timeout);
      reject(new Error(`could not load css chunk: ${chunkName}`));
    };

    timeout = setTimeout(link.onerror, 30000);
    head.appendChild(link);
  });
};
