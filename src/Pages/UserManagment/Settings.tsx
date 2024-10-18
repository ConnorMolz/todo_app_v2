import ChangePassword from "../../Components/Settings/Profile/ChangePassword.tsx";
import NavBar from "../../Components/NavBar.tsx";
import ChangeEmail from "../../Components/Settings/Profile/ChangeEmail.tsx";
import ChangeUsername from "../../Components/Settings/Profile/ChangeUsername.tsx";
import ThemeChooser from "../../Components/Settings/Appearence/ThemeChooser.tsx";
import {Trans} from "react-i18next";
import LanguageChooser from "../../Components/Settings/Appearence/LanguageChooser.tsx";

const Settings = () =>{
    return(
        <div>
            <NavBar/>
            <details className="collapse collapse-arrow border-base-300 bg-base-200 border">
                <summary className="collapse-title text-xl font-medium"><Trans i18nKey="settings.account.title" /></summary>
                <div className="collapse-content">
                    <div className="justify-left">
                        <ChangePassword/>
                        <div className="divider"></div>
                        <ChangeEmail/>
                        <div className="divider"></div>
                        <ChangeUsername/>
                    </div>
                </div>
            </details>
            <details className="collapse collapse-arrow border-base-300 bg-base-200 border">
                <summary className="collapse-title text-xl font-medium"><Trans i18nKey="settings.appearance.title" /> </summary>
                <div className="collapse-content">
                    <div className="justify-left">
                        <ThemeChooser/>
                        <div className="divider"></div>
                        <LanguageChooser />
                    </div>
                </div>
            </details>
        </div>
    )
}

export default Settings;