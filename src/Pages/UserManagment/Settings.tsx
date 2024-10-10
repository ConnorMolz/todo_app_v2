import ChangePassword from "../../Components/Settings/Profile/ChangePassword.tsx";
import NavBar from "../../Components/NavBar.tsx";
import ChangeEmail from "../../Components/Settings/Profile/ChangeEmail.tsx";
import ChangeUsername from "../../Components/Settings/Profile/ChangeUsername.tsx";
import ThemeChooser from "../../Components/Settings/Appearence/ThemeChooser.tsx";

const Settings = () =>{
    return(
        <div>
            <NavBar/>
            <details className="collapse collapse-arrow border-base-300 bg-base-200 border">
                <summary className="collapse-title text-xl font-medium">Account Management</summary>
                <div className="collapse-content">
                    <div className="justify-left">
                        <ChangePassword/>
                        <ChangeEmail/>
                        <ChangeUsername/>
                    </div>
                </div>
            </details>
            <details className="collapse collapse-arrow border-base-300 bg-base-200 border">
                <summary className="collapse-title text-xl font-medium">Appearance Settings</summary>
                <div className="collapse-content">
                    <div className="justify-left">
                        <ThemeChooser/>
                    </div>
                </div>
            </details>
        </div>
    )
}

export default Settings;