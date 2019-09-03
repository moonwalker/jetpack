import React, { Component } from 'react';
import style from './style_spinner';

export default class Loading extends Component {
  render() {
    const circles = new Array(12).fill();
    return (
      <div className={style.loading}>
        {circles.map((_, i) => (
          <div key={i} className={style.dot}></div>
        ))}
      </div>
    );
  }
}
