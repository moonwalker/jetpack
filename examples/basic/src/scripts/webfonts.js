import config from '../config'

(function(d) {
  if (config.webfonts) {
    global.WebFontConfig = {
      google: {
        families: [`${config.webfonts}`]
      }
    };
    var wf = d.createElement('script');
    wf.src = 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js';
    wf.async = true;
    d.body.appendChild(wf);
  }
})(document);
