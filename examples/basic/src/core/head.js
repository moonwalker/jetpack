import React, { Component } from 'react';
import { getLocalizedSiteSetting, getMarket } from './dal';
import { getViewMetaData } from './utils';
import store from './store';
import config from '../config'

const _head = {
  meta: []
};

const siteSettingId = store.get('siteSettingId') || config.defaultSiteSettingId;
const market = store.get('market') || config.defaultMarket;
@getLocalizedSiteSetting(siteSettingId)
@getMarket(market)
export default class Head extends Component {
  render() {
    _head.meta = []
    getViewMetaData(this.props, _head);
    return null;
  }
}

export function flushHead() {
  return _head;
}
