import React, { Component } from 'react';
import Review from '../review';
import Loading from '../loading/spinner';

export default class Reviews extends Component {
  render() {
    const reviews = this.props.reviews || []
    if (!this.props.reviews) return (<Loading />);
    return (
      <div>
        {reviews.map((review, index) => (
          <Review key={index} position={index + 1} review={review} {...this.props} />
        ))}
      </div>
    )
  }
}
