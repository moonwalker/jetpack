import React, { Component } from 'react';
import style from './style';

export default class Loading extends Component {
  render() {
    return (
      <div className={style.progress_container}>
        <div className={style.progress}>
          <div className={style.progress_bar}></div>
        </div>
      </div>
    );
  }
}
