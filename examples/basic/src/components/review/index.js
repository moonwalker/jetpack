import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import CasinoBonus from '../casinobonus';
import CasinoFeatures from '../casinofeatures';
import CasinoRating from '../casinorating';
import ClaimIt from './claimit'
import { SmallHidden, SiteLogo } from '../common'

import style from './style.css';

export default class Review extends Component {
  render() {
    const review = this.props.review || {}
    const hasLogo = review.brand.logo && review.brand.logo.length;
    const logoImage = hasLogo ? review.brand.logo[0].file.url : null;
    return (
      <section className={style.review}>
        <SmallHidden className={style.rating}>
          <div className={style.number}>
            <h3>{this.props.position}</h3>
          </div>
        </SmallHidden>

        <div className={style.small_row}>
          <div className={style.brand}>
            <div className={style.logoWrap}>
              {logoImage ? (<img src={logoImage} alt={review.brand.name} />) : (<SiteLogo />)}
              <Link to={review.link} target="_blank" rel="noopener nofollow" className={style.logoLink}>{review.brand.name}</Link>
            </div>
            <CasinoRating rating={review.rating} />
          </div>

          <CasinoFeatures features={review.pros} />

          <CasinoBonus bonuses={review.brand.bonuses} />

        </div>

        <ClaimIt link={review.link} locale={this.props.locale} />
      </section >
    )
  }
}
