import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { SiteLogo } from '../common';
import style from './style.css';


export default class Footer extends Component {
    render() {
        return (
            <footer className={style.footer}>
                {/* <div className={style.quickLinks}>
                    <div className={style.linkSection}>
                        <h4>Most popular</h4>
                        <p>
                            <NavLink activeClassName={style.active} to="/">Home</NavLink><br />
                            <NavLink activeClassName={style.active} to="/en/contact">Contact</NavLink><br />
                            <a href="">kaboo two</a>
                        </p>
                    </div>

                    <div className={style.linkSection}>
                        <h4>Less popular</h4>
                        <p>
                            <a href="">kaboo two</a><br />
                            <a href="">kaboo</a><br />
                            <a href="">beardy balls</a>
                        </p>
                    </div>

                    <div className={style.linkSection + " small-hidden"}>
                        <h4>Trending</h4>
                        <p>
                            <a href="">kaboo two</a><br />
                            <a href="">beardy balls</a><br />
                            <a href="">kaboo</a>
                        </p>
                    </div>

                    <div className={style.linkSection + " small-hidden"}>
                        <h4>Contact</h4>
                        <p>
                            <a href="">kaboo</a><br />
                            <a href="">kaboo two</a><br />
                            <a href="">beardy balls</a>
                        </p>
                    </div>
                </div> */}

                <div className={style.logoWrap}>
                    
                </div>

                {/* <div className={style.disclaimer}>
                    <p>Disclaimer: we take no responsibility for anything, Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec condimentum et felis pulvinar mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec lacinia nulla vel turpis pharetra dapibus. Ut tempor sem eget varius vehicula. In hac habitasse platea dictumst. Etiam vulputate tellus mi, non scelerisque lorem mollis id. Sed aliquet, sem ac tincidunt auctor, nisl enim venenatis urna, vitae rutrum lacus orci ac odio.</p>
                </div> */}

            </footer>
        );
    }
}
