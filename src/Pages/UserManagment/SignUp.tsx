import LogInHeader from "../../Components/LogInHeader.tsx";
import {Form, useNavigate} from "react-router-dom";
import {useState} from "react";
import {pocket_base} from "../../lib/pocket_base.ts";
import { generateRandomString } from "../../lib/generatIdenticonString.ts";

const SignUp = () => {

    // Page variables
    const [ username, setUsername ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ repeatPassword, setRepeatPassword ] = useState("");
    const navigate = useNavigate();

    // Alerts
    const [ passwordsNotMatchingAlert, setPasswordsNotMatchingAlert ] = useState(false);
    const [ registrationError, setRegistrationError ] = useState(false);
    const [ registrationErrorMessage, setRegistrationErrorMessage ] = useState("");
    const [ registrationSuccess, setRegistrationSuccess ] = useState(false);


    const createUser = async (e:any) => {
        // Prevent Page reload
        e.preventDefault();

        // If both passwords are not the same the user get an Alert about it
        if(password != repeatPassword){
            setPasswordsNotMatchingAlert(true);
            setTimeout(()=>setPasswordsNotMatchingAlert(false), 5000);
        }

        // User data for the new user at the Backend
        const userData = {
            "username": username,
            "email": email,
            "password": password,
            "passwordConfirm": repeatPassword,
            "emailVisibility": true,
            "name": "",
            "identicon": generateRandomString(10)
        };

        // Check if the mail is already in use
        const queryFilter = 'email = "' + email + '"';
        const records = await pocket_base.collection('users').getFullList({
           filter: queryFilter
        });

        // If one or more records with the given mail address already exists an
        // Error alert is showing and the app will send the registration request
        if(records.length != 0){
            setRegistrationErrorMessage("A User with this email is already registered.")
            setRegistrationError(true);
            setTimeout(()=>setRegistrationError(false), 5000);
            setTimeout(()=>setRegistrationErrorMessage(""), 5000);
            return;
        }

        // Create the user
        await pocket_base.collection("users").create(userData).catch((err:Error) => {
            setRegistrationError(true);
            setRegistrationErrorMessage(err.message);
            setTimeout(()=>setRegistrationError(false));
            setTimeout(()=>setRegistrationErrorMessage(""));
        });

        // Send a verification Mail and routing the user to the verify page
        await pocket_base.collection('users').requestVerification(email);
        setRegistrationSuccess(true);
        setTimeout(()=>navigate("/"), 3000);

    }

    return (
        <div>
            <LogInHeader />
            <Form onSubmit={createUser}>
                <div className="flex justify-center py-5">
                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                            <path
                                d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                        </svg>
                        <input
                            type="email"
                            className="grow"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                </div>
                <div className="flex justify-center py-5">
                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"/>
                        </svg>
                        <input
                            type="text"
                            className="grow"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                </div>
                <div className="flex justify-center py-5">
                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd"/>
                        </svg>
                        <input
                            type="password"
                            className="grow"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                </div>
                <div className="flex justify-center py-5">
                    <label className="input input-bordered flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                            fill="currentColor"
                            className="h-4 w-4 opacity-70">
                            <path
                                fillRule="evenodd"
                                d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                clipRule="evenodd"/>
                        </svg>
                        <input
                            type="password"
                            className="grow"
                            placeholder="Repeat Password"
                            value={repeatPassword}
                            onChange={(e) => setRepeatPassword(e.target.value)}
                        />
                    </label>
                </div>
                <div className="flex justify-center">
                    <button className="btn btn-neutral">Create Account</button>
                </div>
            </Form>
            {
                passwordsNotMatchingAlert &&
                <div role="alert" className="alert alert-error">
                <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Your Password and the repeated password does not match</span>
                </div>
            }
            {
                registrationError &&
                <div role="alert" className="alert alert-error">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{registrationErrorMessage}</span>
                </div>
            }
            {
                registrationSuccess &&
                <div role="alert" className="alert alert-success">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>Your account is created you will soon get an Email to verify your account.</span>
                </div>
            }
        </div>
    )
}

export default SignUp