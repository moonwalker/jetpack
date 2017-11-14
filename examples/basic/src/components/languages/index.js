import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getSupportedLanguages } from '../../core/dal';
import store from '../../core/store';
import config from '../../config';

import style from './style.css';

const market = store.get('market') || config.defaultMarket

@getSupportedLanguages(market)
export default class Languages extends Component {
    constructor(props) {
        super(props);
        this.handleKeys = this.handleKeys.bind(this);
        this.handleBlur = this.handleBlur.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.state = {
            open: false
        }
    }

    getLanguage(lang) {
        return (this.props.supportedLanguages || []).find(l => (l.code === lang))
    }

    componentDidUpdate() {
        this.dropdown = document.getElementById("languages");
        this.menu = document.getElementById("lang-menu");
        document.addEventListener('click', this.handleBlur, false)
    }

    componentWillUnMount() {
        document.removeEventListener('click', this.handleBlur)
    }

    closeMenu() {
        this.setState({ open: false })
    }

    handleChange() {
        if (!this.state.open && !this.state.positioned) {
            this.setPosition();
            this.state.positioned = true;
        }
        this.setState({
            open: !this.state.open
        })
    }

    handleKeys(e) {
        if (this.state.open && e.key === 'Escape') {
            this.closeMenu();
        }
    }

    handleBlur(e) {
        if (this.state.open && !this.dropdown.contains(e.target)) {
            this.closeMenu();
        }
    }

    setPosition() {
        let horizontalPlacement, verticalPlacement;
        const triggerRect = this.dropdown.getBoundingClientRect();
        const visibility = this.menu.style.visibility;
        const display = this.menu.style.display;
        this.menu.style.visibility = 'hidden';
        this.menu.style.display = 'block';
        const optionsRect = this.menu.getBoundingClientRect();
        this.menu.style.display = display;
        this.menu.style.visibility = visibility;

        if (triggerRect.left + optionsRect.width > window.innerWidth) {
            this.menu.classList.remove('right')
            this.menu.classList.add('left')
        } else if (optionsRect.left < 0) {
            this.menu.classList.remove('left')
            this.menu.classList.add('right')
        }
        if (triggerRect.bottom + optionsRect.height > window.innerHeight) {
            this.menu.classList.remove('bottom')
            this.menu.classList.add('top')
        } else if (optionsRect.top < 0) {
            this.menu.classList.remove('top')
            this.menu.classList.add('bottom')
        }
    }

    render() {
        const language = this.getLanguage(this.props.locale)
        const languages = this.props.supportedLanguages

        //Only show language selector if 2 or more supported languages
        if (!language || !languages || languages.length < 2) return null
        const pathname = this.props.pathname === '/' ? `/${language.code}` : this.props.pathname
        return (
            <button id="languages" className={style.languages} onKeyDown={this.handleKeys} onClick={this.handleChange}>
                <label className={style.dropdown_toggle} data-toggle="dropdown">
                    <span className={style.filter_option}>
                        <span className={style.flag_icon + ' ' + style['flag_' + language.code]}></span>
                        {language.name}
                    </span>
                    &nbsp;<span className={style.caret}></span>
                </label>
                <input type="checkbox" className={style.dropdown_switch} checked={this.state.open} />
                <div id="lang-menu" className={style.dropdown_menu}>
                    <ul className={style.inner}>
                        {languages.map((lang, idx) => {
                            const href = pathname.replace(`/${language.locale || language.code}`, `/${lang.locale || lang.code}`)
                            return (
                                <li key={idx} className={language.code === lang.code
                                    ? style.selected
                                    : null}>
                                    <Link to={href}>
                                        <span className={style.flag_icon + ' ' + style['flag_' + lang.code]}></span>
                                        {lang.name}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </button>
        )
    }
}
