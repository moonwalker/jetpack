import React, { Component } from 'react';
import { interpolate } from '../../core/utils';

import style from './style.css';

export default class CasinoBonus extends Component {
  render() {
    const bonuses = this.props.bonuses || [];
    const bonus = bonuses.length ? bonuses[0] : {}
    return (
      <div className={style.bonus}>
        <h5>{interpolate(bonus.description, bonus)}</h5>
        <h6>{interpolate(bonus.secondaryDescription, bonus)}</h6>
      </div>
    );
  }
}
