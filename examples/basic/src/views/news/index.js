import React, { Component } from 'react';
import { getView, getPage } from '../../core/dal';
import Head from '../../core/head';
import Page from '../../components/page';

@getView('blogEntry')
@getPage('news')
export default class News extends Component {
  render() {
    const { view, page, locale, pathname } = this.props;
    return (
      <div>
        <Head locale={locale} pathname={pathname} {...view}  />
        <Page locale={locale} page={page || {}} />
      </div>
    );
  }
}


