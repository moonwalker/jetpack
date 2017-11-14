import config from '../../config'

const isProd = process.env.ENV === 'production'

export function fmtLocale(lang) {
  if (!lang) return config.defaultLocale
  const split = lang.split('-')
  const length = split.length
  if (split.length > 1) {
    return split.slice(0, length - 1) + `-${split[length - 1].toUpperCase()}`
  }
  return lang
}

export function capitalize(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function interpolate(text, args) {
  if (!text) return '';
  var str = text.toString();
  const keys = str.match(/{{[\w.:-]+}}/gi) || []
  keys.forEach(key => {
    const prop = key.replace("{{", "").replace("}}", "")
    str = str.replace(new RegExp(key, "gi"), args[prop] || '');
  })
  return str;
};

const setMeta = (meta, name, content) => {
  if ((meta.name && meta.name === name ||
    meta.getAttribute('property') === name)) {
    if (content) {
      meta.content = content
    }
    return true
  }
}

export function getProperty (obj, key) {
  return key.split(".").reduce(function(o, x) {
      return (typeof o == "undefined" || o === null) ? o : o[x];
  }, obj);
}

const setRelLinks = (head, localizedSiteSetting, market, path) => {
  if(market && market.supportedLanguages){
    market.supportedLanguages.forEach(language => {
      const langLocale = language.locale || language.code;
      const linkElem = document.createElement("link");
      linkElem.setAttribute('rel', 'alternate')
      linkElem.setAttribute('href', `https://${localizedSiteSetting.domain}/${langLocale}${path}`)
      linkElem.setAttribute('hreflang', langLocale)
      head.appendChild(linkElem);
    })
    const defaultLocale = market.defaultLanguage.locale || market.defaultLanguage.code;
    const defaultLinkElem = document.createElement("link");
    defaultLinkElem.setAttribute('rel', 'alternate')
    defaultLinkElem.setAttribute('href', `https://${localizedSiteSetting.domain}/${defaultLocale}${path}`)
    defaultLinkElem.setAttribute('hreflang', 'x-default')
    head.appendChild(defaultLinkElem);
  }
}

const pushMeta = (head, meta) => {
  if (!head.meta.includes(meta))
    head.meta.push(meta)
}

export function getViewMetaData({ localizedSiteSetting, market, locale, title, description, image, pathname }, head) {
  if (!(localizedSiteSetting && market)) return null
  const envTitlePrefix = isProd ? '' : process.env.ENV + ' - ';
  const titleContent = title || localizedSiteSetting.title;
  const ttl = envTitlePrefix + titleContent;

  const desc = description || localizedSiteSetting.description;
  const imgUrl = getProperty(image, 'url') || getProperty(localizedSiteSetting, 'url') || '';
  const httpPrefix = `http${isProd ? 's' : ''}`
  let path = (pathname || '').replace(new RegExp(`^/${locale}`), '')
  if (path.charAt(path.length - 1) !== '/')
    path = path + '/'
  // meta tags will already exist because static generation adds them to each page
  if (process.browser) {
    document.getElementsByTagName('html')[0].lang = locale;
    document.title = ttl;

    const allMetaElements = document.getElementsByTagName('meta');
    for (var i = 0; i < allMetaElements.length; i++) {
      if (setMeta(allMetaElements[i], 'og:title', ttl)) continue
      if (setMeta(allMetaElements[i], 'description', desc)) continue
      if (setMeta(allMetaElements[i], 'og:description', desc)) continue
      if (setMeta(allMetaElements[i], 'og:image', `${httpPrefix}${imgUrl}`)) continue
    }
    const allLinkElements = document.querySelectorAll("link[rel=\"alternate\"]");
    const headElement = document.getElementsByTagName("head")[0];
    allLinkElements.forEach(l => headElement.removeChild(l));
    setRelLinks(headElement, localizedSiteSetting, market, path);
  } else {
    head.lang = locale;
    head.title = ttl
    head.siteName = localizedSiteSetting.name;
    head.url = `${httpPrefix}://${localizedSiteSetting.domain}` // /${pathname || ''};
    pushMeta(head, `<meta property="og:title" content="${ttl}"/>`)
    pushMeta(head, `<meta name="description" content="${desc}"/>`)
    pushMeta(head, `<meta property="og:description" content="${desc}"/>`)
    if (imgUrl) {
      pushMeta(head, `<meta property="og:image" content="${httpPrefix}:${imgUrl}"/>`)
    }
    market.supportedLanguages.forEach(language => {
      const langLocale = language.locale || language.code;
      pushMeta(head, `<link rel="alternate" href="https://${localizedSiteSetting.domain}/${langLocale}${path}" hreflang="${langLocale}" />`)
    })
    const defaultLocale = market.defaultLanguage.locale || market.defaultLanguage.code;
    pushMeta(head, `<link rel="alternate" href="https://${localizedSiteSetting.domain}/${defaultLocale}${path}" hreflang="x-default" />`)
  }
  return null
}

