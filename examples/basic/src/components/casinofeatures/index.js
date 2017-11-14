import React, { Component } from 'react';
import { SmallHidden } from '../common'
import { capitalize } from '../../core/utils'
import style from './style.css';

export default class CasinoFeatures extends Component {
  render() {
    const features = this.props.features || []
    return (
      <SmallHidden className={style.features}>
        <ul>
          {features.slice(0, 5).map((pro, i) => (<li key={i}>{capitalize(pro)}</li>))}
        </ul>
      </SmallHidden>
    );
  }
}