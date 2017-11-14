import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getLocalizedSiteSetting } from '../../core/dal';
import MainMenu from '../mainmenu';
import { SiteIcon, SiteName } from '../common';
import store from '../../core/store';
import config from '../../config';

import style from './style.css';

const siteSettingId = store.get('siteSettingId') || config.defaultSiteSettingId

@getLocalizedSiteSetting(siteSettingId)
export default class Header extends Component {
  render() {
    const siteName = this.props.localizedSiteSetting && this.props.localizedSiteSetting.name || '';
    return (
      <header  className={style.header}>
        <SiteName siteName={siteName} />
        <div className={style.luna}></div>
        <MainMenu {...this.props} />
      </header>
    );
  }
}
