// Small Header for the login page
// The Header has no functions it's only for the optic
import {Link} from "react-router-dom";
import {Trans, useTranslation} from "react-i18next";

const LogInHeader = () => {
    const { t } = useTranslation();
    return(
        <div>
            <div className="navbar bg-base-200">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h7"/>
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                            <li><Link to={"/"}>{t('loginPage.login')}</Link></li>
                            <li><Link to={"/signUp"}>{t('loginPage.signUp')}</Link></li>
                            <li><Link to={"/user/forgotPassword"}>{t('loginPage.forgotPassword')}</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-center">
                    <a className="btn btn-ghost text-xl"><Trans i18nKey="appTitle">Todo App</Trans> </a>
                </div>
                <div className="navbar-end"></div>
            </div>
        </div>
    )
}

export default LogInHeader;