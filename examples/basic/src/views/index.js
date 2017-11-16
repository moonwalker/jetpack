import dynamic from '../core/dynamic';
import loading from '../components/loading'

export default {
  blogEntryView: dynamic({
    chunkName: 'views/blogEntry',
    clientLoad: () => import('./blogEntry' /* webpackChunkName: 'views/blogEntry' */),
    serverLoad: () => require.resolveWeak('./blogEntry'),
    loading: loading
  })
}
