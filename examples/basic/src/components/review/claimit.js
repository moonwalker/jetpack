import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import style from './style.css';
import Translate from '../translate';

@Translate
class ClaimIt extends Component {
    render() {
        return (<div className={style.claimit}>
            {this.props.link ?
                (<Link to={this.props.link} target="_blank" rel="noopener nofollow">{this.props.translate('claim_bonus')}</Link>) :
                (<span></span>)
            }
        </div>)
    }
}

export default ClaimIt
