import ChangePassword from "../../Components/Settings/Profile/ChangePassword.tsx";
import NavBar from "../../Components/NavBar.tsx";
import ChangeEmail from "../../Components/Settings/Profile/ChangeEmail.tsx";

const Settings = () =>{
    return(
        <div>
            <NavBar />
            <ChangePassword />
            <ChangeEmail />
        </div>
    )
}

export default Settings;