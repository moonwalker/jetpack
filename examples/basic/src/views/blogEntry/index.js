import React, { Component } from 'react';
import { Head, getView, getPage } from '@moonwalker/lifesupport';

@getPage()
export default class Home extends Component {
  render() {
    const { page, locale, pathname } = this.props;
    return (
      <div>
        <Page locale={locale} page={page} />
      </div>
    );
  }
}
