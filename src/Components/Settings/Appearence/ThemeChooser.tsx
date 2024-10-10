import {themeChange} from "theme-change";

const ThemeChooser = () => {

    function changeTheme() {
        themeChange(true);
        setTimeout(() => {themeChange(false)}, 2000);
    }

    return (
        <div>
            <h1>Theme Chooser</h1>
            <select data-choose-theme onChange={changeTheme}>
                <option value="">Default</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
            </select>
        </div>
    )
}

export default ThemeChooser;