import React, { Component } from 'react';
import { getView, getPage, getReviews } from '../../core/dal';
import Head from '../../core/head';
import Languages from '../../components/languages';
import Page from '../../components/page';
import Reviews from '../../components/reviews';

@getView('home')
@getPage('home')
@getReviews()
export default class Home extends Component {
  render() {
    const { view, page, reviews, locale, pathname } = this.props;
    return (
      <div>
        <Head locale={locale} pathname={pathname} {...view}  />
        <Reviews locale={locale} reviews={reviews} />
        <Page locale={locale} page={page || {}} />
        
        <Languages locale={locale} pathname={pathname}/>
      </div>
    );
  }
}
