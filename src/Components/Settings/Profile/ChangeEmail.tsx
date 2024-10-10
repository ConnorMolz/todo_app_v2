import {Form, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {AuthModel} from "pocketbase";
import {pocket_base} from "../../../lib/pocket_base.ts";

const ChangeEmail = () => {

    // Page variables
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const navigate = useNavigate();

    // Email change variables
    const [ currentEmail, setCurrentEmail ] = useState('');
    const [ newEmail, setNewEmail ] = useState('');

    // Alerts
    const [ errorAlert, setErrorAlert ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ successAlert, setSuccessAlert ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState('');

    // Check Session else redirect the user to the auth page
    useEffect(()=>{
        if(pocket_base.authStore.isValid){
            setSession(pocket_base.authStore.model)
            setCurrentEmail(session?.email);
        }
        else{
            navigate("/");
        }
    },[]);

    const changeMail = async (e:any) =>{
        e.preventDefault();
        if(!session)return;
        // Prepare data package for the email update
        const data = new FormData();
        data.append("email", currentEmail);

        await pocket_base.collection('users').requestEmailChange(newEmail).catch((err:any) => {
            setErrorAlert(true);
            setErrorMessage(err.message);
            setTimeout(() => setErrorAlert(false), 5000);
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        });
        setSuccessAlert(true);
        setSuccessMessage('You got a mail to your new e-mail address to verify your e-mail change now!');
        setTimeout(() => setSuccessAlert(false), 7000);
        setTimeout(() => setSuccessMessage(''), 7000);
    }

    return(
        <div>

            <Form onSubmit={changeMail}>
                <div className="flex text-3xl">Change your E-Mail address</div>
                <div className="flex  py-5">
                    <input
                        disabled={currentEmail !== null}
                        required={true}
                        type="email"
                        placeholder="Enter your current email"
                        className="input input-bordered w-full max-w-xs"
                        value={currentEmail}
                        onChange={(e) => {
                            setCurrentEmail(e.target.value)
                        }}
                    />
                </div>
                <div className="flex  py-5">
                    <input
                        required={true}
                        type="email"
                        placeholder="Enter your new email"
                        className="input input-bordered w-full max-w-xs"
                        value={newEmail}
                        onChange={(e) => {
                            setNewEmail(e.target.value)
                        }}
                    />
                </div>
                <div className="flex ">
                    <button className="btn btn-neutral px-5 mx-2">Request E-Mail change</button>
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
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                    <span>{errorMessage}</span>
                </div>
            }
            {
                successAlert &&


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
                    <span>{successMessage}</span>
                </div>
            }
        </div>
    )
}

export default ChangeEmail