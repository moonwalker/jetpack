import React, { Component } from 'react';
import Header from '../header';
import Footer from '../footer';
import style from './style.css';

export default class Layout extends Component {
  render() {
    const { locale, pathname } = this.props;
    return (
      <div id="app">
        <Header locale={locale} pathname={pathname} />
        <main className={style.main}>{this.props.children}</main>
        <Footer />
      </div>
    );
  }
}
