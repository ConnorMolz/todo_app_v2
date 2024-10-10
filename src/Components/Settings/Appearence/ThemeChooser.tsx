import {themeChange} from "theme-change";
import {useEffect} from "react";

const ThemeChooser = () => {

    useEffect(() => {
        themeChange(false)

    }, [])

    return (
        <div>
            <h1>Choose your theme</h1>
            <select data-choose-theme className="select select-bordered w-full max-w-xs">
                <option disabled value="">Pick a theme</option>
                <option value="">Default</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="corporate">Corporate</option>
            </select>
        </div>
    )
}

export default ThemeChooser;