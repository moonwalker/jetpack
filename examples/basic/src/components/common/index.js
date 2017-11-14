import React, { Component } from 'react';
import style from './style'

export const SmallHidden = (props) => {
    return (<div className={props.className + ' ' + style.small_hidden}>
        {props.children}
    </div>)
}

export const SiteLogo = (props) => {
    return (<img src="/img/logo/logo-horizontal-colour.svg" alt={props.siteName || ''} {...props} />)
}

export const SiteIcon = (props) => {
    return (<img src="/img/logo/dreamscasino_moon_min.png" alt={props.siteName || ''} {...props} />)
}

export const SiteName = (props) => {
    return (<h1>{props.siteName}</h1>)
}