
module.exports = [
  {
    path: '/:lang/live-casino',
    view: 'liveCasinoView'
  },
  {
    path: '/:lang/casino-bonus',
    view: 'bonusView'
  },
  {
    path: '/:lang/free-spins',
    view: 'freespinsView'
  },
  {
    path: '/:lang/casino/slots',
    view: 'casinoSlotsView'
  },
  {
    path: '/:lang/casino',
    view: 'casinoView'
  },
  {
    path: '/:lang?',
    view: 'homeView'
  },
  // {
  //   path: '/:lang/:game',
  //   view: 'gameView'
  // },
  // {
  //   path: '/:lang/casino/:gameCategory',
  //   view: 'gameCategoryView'
  // }
]
