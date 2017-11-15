import dynamic from '../core/dynamic';
import loading from '../components/loading'

export default {
  homeView: dynamic({
    chunkName: 'views/home',
    clientLoad: () => import('./home' /* webpackChunkName: 'views/home' */),
    serverLoad: () => require.resolveWeak('./home'),
    loading: loading
  })
}
