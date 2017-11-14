import { graphql } from 'react-apollo'
import queries from './queries'

const fetch = (query, variables, property, defaultValue = [], mapper) => {
  const propType = typeof property;
  if (typeof defaultValue == 'function') {
    mapper = defaultValue;
    if (propType === 'string')
      defaultValue = []
    else {
      defaultValue = property;
    }
  }
  if (typeof variables === 'string') {
    if (propType !== 'undefined') {
      defaultValue = property
    }
    property = variables
    variables = {}
  }

  return graphql(query, {
    options: (props) => {
      return { variables: Object.assign({}, props, variables) }
    },
    props: ({ data }) => {
      if (data.error) {
        console.error(data.error.message)
        return { [property]: defaultValue }
      }
      return {
        [property]: mapper ? mapper(data[property]) : data[property]
      }
    }
  })
}

export const getLocalizedSiteSetting = (siteSettingId) => {
  return fetch(queries.localizedSiteSetting, { siteSettingId }, 'localizedSiteSetting', {})
}

export const getMarket = (marketCode) => {
  return fetch(queries.market, { marketCode }, 'market', {})
}

export const getMainMenu = () => {
  return fetch(queries.mainMenu, 'mainMenu', {})
}

export const getPage = (slug) => {
  return fetch(queries.page, { slug }, 'page', {})
}

export const getPhrases = () => {
  return fetch(queries.phrases, 'phrases', {}, phrases => {
    if (!phrases) return phrases
    return phrases.reduce((res, ph) => {
      res[ph.key] = ph.translation
      return res
    }, {})
  })
}

export const getReviews = (orderBy) => {
  return fetch(queries.reviews, { orderBy }, 'reviews')
}

export const getSupportedLanguages = (market) => {
  return fetch(queries.supportedLanguages, { market }, 'supportedLanguages')
}

export const getView = (slug) => {
  return fetch(queries.view, { slug }, 'view', {})
}
