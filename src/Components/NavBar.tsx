import {Link, useNavigate} from "react-router-dom";
import {pocket_base} from "../lib/pocket_base.ts";
//@ts-ignore IDK why the TS-lint is not recognizing the import
import Jdenticon from 'react-jdenticon';
import { useTranslation } from "react-i18next";

const NavBar = () =>{
    // Translation hook
    const { t } = useTranslation();

    // navigate for the logout and Todo pages
    const navigate = useNavigate();
    const session = pocket_base.authStore.model;
    // Logout with navigate to home where the logout is implemented
    function logout(){
        pocket_base.authStore.clear();
        navigate("/");
    }

    return (
        <div className="navbar bg-base-200">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={ 0 } role="button" className="btn btn-ghost btn-circle">
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
                        tabIndex={ 0 }
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><Link to={ "/" }>{t('navBar.home')}</Link></li>
                        <li><Link to={ "/create" }>{t('navBar.addTodo')}</Link></li>
                        <li><Link to={ "/Home/all"}>{t('navBar.allTodos')}</Link></li>
                    </ul>
                </div>
            </div>
            <div className="navbar-center">
                <Link to={ "/" } className="btn btn-ghost text-xl">Todo App</Link>
            </div>
            <div className="navbar-end">
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
                        <div className="avatar">
                            <div className="w-12 rounded-full">
                                <Jdenticon size="48" value={session?.identicon}/>
                            </div>
                        </div>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><Link to={"/settings"}>{t('navBar.settings')}</Link></li>
                        <li>
                            <button onClick={logout}>{t('navBar.logout')}</button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default NavBar;