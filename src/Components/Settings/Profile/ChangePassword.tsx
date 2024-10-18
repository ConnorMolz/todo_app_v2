import {useEffect, useState} from "react";
import {AuthModel} from "pocketbase";
import {Form, useNavigate} from "react-router-dom";
import {pocket_base} from "../../../lib/pocket_base.ts";
import {useTranslation} from "react-i18next";

const ChangePassword = () => {
    // Translation
    const { t } = useTranslation();

    // Page variables
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const navigate = useNavigate();

    // Password change variables
    const [ oldPassword, setOldPassword ] = useState('');
    const [ newPassword, setNewPassword ] = useState('');
    const [ confirmNewPassword, setConfirmNewPassword ] = useState('');

    // Alerts
    const [ errorAlert, setErrorAlert ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState('');
    const [ successAlert, setSuccessAlert ] = useState(false);
    const [ successMessage, setSuccessMessage ] = useState('');

    // Check Session else redirect the user to the auth page
    useEffect(()=>{
        if(pocket_base.authStore.isValid){
            setSession(pocket_base.authStore.model)
        }
        else{
            navigate("/");
        }
    },[]);

    const changePassword = async (e:any) =>{
        e.preventDefault();
        if(!session)return;
        // Prepare data package for the password update
        const data = new FormData();
        data.append("username", session.username);
        data.append("emailVisibility", session.emailVisibility);
        data.append("password", newPassword);
        data.append("passwordConfirm", confirmNewPassword);
        data.append("oldPassword", oldPassword);
        data.append("name", session.name);

        await pocket_base.collection('users').update(session.id, data).catch((err:any) => {
            setErrorAlert(true);
            setErrorMessage(err.message);
            setTimeout(() => setErrorAlert(false), 5000);
            setTimeout(() => setErrorMessage(''), 5000);
            return;
        });
        await pocket_base.collection('users').authWithPassword(session.email, newPassword);
        setSuccessAlert(true);
        setSuccessMessage('Password changed successfully');
        setTimeout(() => setSuccessAlert(false), 5000);
        setTimeout(() => setSuccessMessage(''), 5000);
    }

    return (
        <div>
            <Form onSubmit={changePassword}>
                <div className=" flex">{t('settings.account.changePassword.title')}</div>
                <div className="flex  py-5">
                    <input
                        required={true}
                        type="password"
                        placeholder={t('settings.account.changePassword.currentPassword')}
                        className="input input-bordered input-sm w-full max-w-xs"
                        value={oldPassword}
                        onChange={(e) => {
                            setOldPassword(e.target.value)
                        }}
                    />
                </div>
                <div className="flex  py-5">
                    <input
                        required={true}
                        type="password"
                        placeholder={t('settings.account.changePassword.newPassword')}
                        className="input input-bordered input-sm w-full max-w-xs"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value)
                        }}
                    />
                </div>
                <div className="flex  py-5">
                    <input
                        required={true}
                        type="password"
                        placeholder={t('settings.account.changePassword.confirmPassword')}
                        className="input input-bordered input-sm w-full max-w-xs"
                        value={confirmNewPassword}
                        onChange={(e) => {
                            setConfirmNewPassword(e.target.value)
                        }}
                    />
                </div>
                <div className="flex ">
                    <button className="btn btn-neutral px-5 mx-2">{t('settings.account.changePassword.change')}</button>
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

export default ChangePassword;