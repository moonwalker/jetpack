import React, { Component } from 'react';
import { Head, getView, getPage } from '@moonwalker/lifesupport';

@getView('blogEntry')
@getPage('home')
export default class Home extends Component {
  render() {
    const { view, page, locale, pathname } = this.props;
    return (
      <div>
        <Head locale={locale} pathname={pathname} {...view} />
        {/*<Page locale={locale} page={page || {}} />*/}
      </div>
    );
  }
}
