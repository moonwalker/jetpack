import gql from 'graphql-tag'

export default {
    languages: gql`
query languages {
    languages {
        name
        code
        locale
	  }
}`,
market: gql`
query market($marketCode: String!) {
    market(code: $marketCode) {
        supportedLanguages{
            locale
            code
        }
        defaultLanguage{
            locale
            code
        }
    }
}`,
    markets: gql`
query markets {
    markets {
        code
	  }
}`,
mainMenu: gql`
query mainMenu($locale: String!) {
    mainMenu(locale: $locale) {
        items{
            label
            route {
              path
            }
          }
	  }
}`,
    page: gql`
query page($locale: String!, $slug: String!) {
    page(locale: $locale, slug: $slug) {
        slug
        title
        content
    }
}`,
    reviews: gql`
query reviews($locale: String!, $orderBy: String) {
    reviews(locale: $locale, orderBy: $orderBy) {
        title
        brand {
            name
            link
            logo {
                file {
                    url
                }
            }
            bonuses {
                description
                secondaryDescription
                type
                percent
                amount
                wagerRequirement
            }
        }
        rating
        pros
        link
      }
}`,
    phrases: gql`
query phrases($locale: String!) {
    phrases(locale: $locale) {
        key,
        translation
    }
}`,
    supportedLanguages: gql`
query supportedLanguages($market: String!) {
    supportedLanguages(market: $market) {
        code
        name
        locale
        order
    }
}`,
    view: gql`
query view($locale: String!, $slug: String!) {
    view(locale: $locale, slug: $slug) {
        title,
        description,
        image {
            file {
                url
            }
        }
    }
}`,
    localizedSiteSetting: gql`
query localizedSiteSetting($locale: String!, $siteSettingId: String!) {
    localizedSiteSetting(locale: $locale, siteSettingId: $siteSettingId) {
        name
        title
        description
        domain
        image {
          file {
            url
          }
        }
    }
}`
}