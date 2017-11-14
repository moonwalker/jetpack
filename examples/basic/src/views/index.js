import dynamic from '../core/dynamic';
import loading from '../components/loading'

export default {
  homeView: dynamic({
    chunkName: 'views/home',
    clientLoad: () => import('./home' /* webpackChunkName: 'views/home' */),
    serverLoad: () => require.resolveWeak('./home'),
    loading: loading
  }),
  casinoView: dynamic({
    chunkName: 'views/casino',
    clientLoad: () => import('./casino' /* webpackChunkName: 'views/casino' */),
    serverLoad: () => require.resolveWeak('./casino'),
    loading: loading
  }),
  bonusView: dynamic({
    chunkName: 'views/casino-bonus',
    clientLoad: () => import('./casino-bonus' /* webpackChunkName: 'views/casino-bonus' */),
    serverLoad: () => require.resolveWeak('./casino-bonus'),
    loading: loading
  }),
  freespinsView: dynamic({
    chunkName: 'views/casino-freespins',
    clientLoad: () => import('./casino-freespins' /* webpackChunkName: 'views/casino-freespins' */),
    serverLoad: () => require.resolveWeak('./casino-freespins'),
    loading: loading
  }),
  liveCasinoView: dynamic({
    chunkName: 'views/live-casino',
    clientLoad: () => import('./live-casino' /* webpackChunkName: 'views/live-casino' */),
    serverLoad: () => require.resolveWeak('./live-casino'),
    loading: loading
  }),
  gameView: dynamic({
    chunkName: 'views/game',
    clientLoad: () => import('./game' /* webpackChunkName: 'views/game' */),
    serverLoad: () => require.resolveWeak('./game'),
    loading: loading
  }),
  gameCategoryView: dynamic({
    chunkName: 'views/game-category',
    clientLoad: () => import('./game-category' /* webpackChunkName: 'views/game-category' */),
    serverLoad: () => require.resolveWeak('./game-category'),
    loading: loading
  }),
  newsView: dynamic({
    chunkName: 'views/news',
    clientLoad: () => import('./news' /* webpackChunkName: 'views/news' */),
    serverLoad: () => require.resolveWeak('./news'),
    loading: loading
  }),
  casinoSlotsView: dynamic({ // TEMP!!!
    chunkName: 'views/casino-slots',
    clientLoad: () => import('./casino-slots' /* webpackChunkName: 'views/casino-slots' */),
    serverLoad: () => require.resolveWeak('./casino-slots'),
    loading: loading
  }),
}
