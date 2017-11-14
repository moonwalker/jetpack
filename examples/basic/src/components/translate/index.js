import React, { Component } from 'react';
import { interpolate } from '../../core/utils'
import { getPhrases } from '../../core/dal';


export default TranslateComponent => {
  @getPhrases()
  class Translate extends Component {
    translate = (key, args) => {
      const phrases = this.props.phrases || {}
      return interpolate(phrases[key], args)
    }

    render() {
      return (
        <TranslateComponent translate={this.translate} {...this.props} />
      )
    }
  }
  return Translate
}