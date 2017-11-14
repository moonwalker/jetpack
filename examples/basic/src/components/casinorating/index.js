import React, { Component } from 'react';
import style from './style.css';

export default class CasinoRating extends Component {
  render() {
    const rating = this.props.rating || 0
    const ratingwhole = Math.floor(rating)
    const ratingfilled = Array(ratingwhole).fill()
    const ratinghalf = Math.ceil(rating - ratingwhole)
    const ratingempty = Array(5 - ratingwhole - ratinghalf).fill()
    return (
      <div className={style.stars}>
        {ratingfilled.map((_, i) => (
          <span key={i} className={style.star_icon + " " + style.full}>&#9734;</span>
        ))}
        {ratinghalf ?
          <span className={style.star_icon + " " + style.half}>&#9734;</span>
          : null
        }
        {ratingempty.map((_, i) => (
          <span key={i} className={style.star_icon}>&#9734;</span>
        ))}
      </div>
    )
  }
}
