import {themeChange} from "theme-change";

const ThemeChooser = () => {

    function changeTheme() {
        // Function to enable the theme change
        themeChange(false);
        // Disable after 2 seconds
        setTimeout(() => {themeChange(true)}, 2000);
    }

    return (
        <div>
            <h1>Theme Chooser</h1>
            <select data-choose-theme onChange={changeTheme} className="select select-bordered w-full max-w-xs">
                <option value="">Default</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="corporate">Corporate</option>
            </select>
        </div>
    )
}

export default ThemeChooser;