import {Form, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {pocket_base} from "../../../lib/pocket_base.ts";

const ChangeUsername = () => {

    // Page variables
    const session = pocket_base.authStore.model;
    const navigate = useNavigate();

    // Email change variables
    const [ currentName, setCurrentName ] = useState(session?.username);
    const [ newName, setNewName ] = useState('');

    // Alerts
    const [ errorAlert, setErrorAlert ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ successAlert, setSuccessAlert ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState('');

    // Check Session else redirect the user to the auth page
    useEffect(()=>{
        if(pocket_base.authStore.isValid){
            setCurrentName(session?.username);
        }
        else{
            navigate("/");
        }
    },[]);

    const changeName = async (e:any) =>{
        e.preventDefault();
        if(!session)return;
        // Prepare data package for the email update
        const data = new FormData();
        data.append("username", newName);

        await pocket_base.collection('users').update(session.id, data).catch((err:any) => {
            setErrorAlert(true);
            setErrorMessage(err.message);
            setTimeout(() => setErrorAlert(false), 5000);
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        });
        setTimeout(() => pocket_base.authStore.clear(), 3000);
        setTimeout(() => navigate("/"), 3000);
        setSuccessAlert(true);
        setSuccessMessage('Username is changed successfully');
        setTimeout(() => setSuccessAlert(false), 7000);
        setTimeout(() => setSuccessMessage(''), 7000);
    }

    return(
        <div>

            <Form onSubmit={changeName}>
                <div className="flex text-3xl">Change your password</div>
                <div className="flex  py-5">
                    <input
                        disabled={true}
                        required={true}
                        type="text"
                        placeholder="Enter your current username"
                        className="input input-bordered w-full max-w-xs"
                        value={currentName}
                        onChange={(e) => {
                            setCurrentName(e.target.value)
                        }}
                    />
                </div>
                <div className="flex  py-5">
                    <input
                        required={true}
                        type="text"
                        placeholder="Enter your new username"
                        className="input input-bordered w-full max-w-xs"
                        value={newName}
                        onChange={(e) => {
                            setNewName(e.target.value)
                        }}
                    />
                </div>
                <div className="flex ">
                    <button className="btn btn-neutral px-5 mx-2">Change Username</button>
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

export default ChangeUsername