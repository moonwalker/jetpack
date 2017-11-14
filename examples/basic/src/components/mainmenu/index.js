import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getMainMenu } from '../../core/dal'
import config from '../../config'

import style from './style.css'

@getMainMenu()
export default class MainMenu extends Component {

    closeMenu() {
        document.getElementById("menuToggle").checked = false
    }

    render() {
        const menuItems = this.props.mainMenu && this.props.mainMenu.items;
        const locale = this.props.locale;
        if (!(menuItems && locale)) return null;
        const currentPath = this.props.pathname;
        return (
            <div>
                <input type="checkbox" id="menuToggle" className={style.menuToggle} />
                <label htmlFor="menuToggle" className={style.menu_toggle}>&#9776;</label>
                <nav className={style.menu} onClick={this.closeMenu}>
                    {menuItems.map((link, index) => {
                        const pathname = link.route && link.route.path;
                        const href = (link.route && link.route.path ? ('/' + locale + link.route.path) : '');
                        const activeClass = (currentPath === pathname ? style.active : '')
                        return link.external ?
                            <a key={index} href={link.external}>{link.label}</a>
                            :
                            <Link key={index} to={href} className={activeClass}>{link.label}</Link>
                    })}
                </nav>
                <label htmlFor="menuToggle" className={style.menu_mask} />
            </div>
        )
    }
}