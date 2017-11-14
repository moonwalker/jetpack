import React, { Component } from 'react';
import Loading from '../loading/spinner';
import Markdown from '../common/markdown';
import style from './style.css';

export default class Page extends Component {
    render() {
        const page = this.props.page
        if (!page) return (<Loading />);
        return (
            <div>
                <div className={style.page}>
                    <h1>{page.title}</h1>
                    <Markdown source={page.content} />
                </div>
                <div id={style.mainBase}>
                    <h4>{page.title}</h4>
                </div>
            </div>
        )
    }
}
