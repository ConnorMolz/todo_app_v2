import {themeChange} from "theme-change";
import {useEffect} from "react";
import {Trans} from "react-i18next";

const ThemeChooser = () => {

    useEffect(() => {
        themeChange(false)

    }, [])

    return (
        <div>
            <Trans i18nKey="settings.appearance.options.title"></Trans>
            <div>
                <select data-choose-theme className="select select-bordered w-full max-w-xs">
                    <option value=""><Trans i18nKey="settings.appearance.options.default"/></option>
                    <option value="dark"><Trans i18nKey="settings.appearance.options.dark"/></option>
                    <option value="light"><Trans i18nKey="settings.appearance.options.light"/></option>
                    <option value="corporate"><Trans i18nKey="settings.appearance.options.corporate"/></option>
                    <option value="aqua"><Trans i18nKey="settings.appearance.options.aqua"/></option>
                </select>
            </div>
        </div>
    )
}

export default ThemeChooser;