// Small Header for the login page
// The Header has no functions it's only for the optic
import {Link} from "react-router-dom";

const LogInHeader = () => {
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
                            <li><Link to={"/"}>Log In</Link></li>
                            <li><Link to={"/singUp"}>Sing Up</Link></li>
                            <li><Link to={"/user/forgotPassword"}>Forgot Password</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="navbar-center">
                    <a className="btn btn-ghost text-xl">Todo App</a>
                </div>
                <div className="navbar-end"></div>
            </div>
        </div>
    )
}

export default LogInHeader;