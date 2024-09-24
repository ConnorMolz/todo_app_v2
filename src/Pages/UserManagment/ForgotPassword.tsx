import LogInHeader from "../../Components/LogInHeader.tsx";
import {useState} from "react";
import {Form, useNavigate} from "react-router-dom";
import {pocket_base} from "../../lib/pocket_base.ts";

const ForgotPassword = () => {

    // Page variables
    const [ email, setEmail ] = useState('');
    const navigate = useNavigate();

    // Alert
    const [ success, setSuccess ] = useState(false);
    const [ errorAlert, setErrorAlert ] = useState(false);
    const [ errorAlertMessage, setErrorAlertMessage ] = useState('');

    const sendEmail = async () => {
        await pocket_base.collection('users').requestPasswordReset(email).catch((error) => {
            // If an error raise the Alert will show it
            setErrorAlertMessage(error.message);
            setErrorAlert(true);

            setTimeout(() => setErrorAlert(false), 5000);
            setTimeout(() => setErrorAlertMessage(''), 5000);
            return;
        });

        setSuccess(true);
        setTimeout(()=>navigate("/"), 3000);

    }

    return(
        <div>
            <LogInHeader />
            <Form onSubmit={sendEmail} className="py-20">
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

                <div className="flex justify-center">
                    <button className="btn btn-neutral">Request Password reset</button>
                </div>

            </Form>
            {
                errorAlert &&
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
                    <span>{errorAlertMessage}</span>
                </div>
            }
            {
                success &&
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
                    <span>You will soon get an email with your password reset.</span>
                </div>
            }
        </div>
    );
}

export default ForgotPassword;