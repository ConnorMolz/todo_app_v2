import {Trans, useTranslation} from "react-i18next";

const LanguageChooser = () => {
    const { i18n } = useTranslation();
    return (
        <div>
            <Trans i18nKey="settings.appearance.language.title"></Trans>
            <div>
                <select
                    className="select select-bordered w-full max-w-xs"
                    value={i18n.language}
                    onChange={(e) => {i18n.changeLanguage(e.target.value).then()}}
                >
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                </select>
            </div>
        </div>
    );
}

export default LanguageChooser;