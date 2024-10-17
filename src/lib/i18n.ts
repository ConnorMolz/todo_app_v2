import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
    // detect user language
    // learn more: https://github.com/i18next/i18next-browser-languageDetector
    .use(LanguageDetector)
    // pass the i18n instance to react-i18next.
    .use(initReactI18next)
    // init i18next
    // for all options read: https://www.i18next.com/overview/configuration-options
    .init({
        debug: true,
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
        },
        resources: {
            en: {
                translation: {
                    appTitle: "Todo App",
                    loginPage:{
                        email: "Email",
                        password: "Password",
                        login: "Login",
                        signUp: "Sign Up",
                        forgotPassword: "Forgot Password",
                    },
                    navBar: {
                        home: "Home",
                        addTodo: "Add Todo",
                        allTodos: "All Todos",
                        settings: "Settings",
                        logout: "Logout"
                    },
                    home: {
                        ownTodos: "Show Only My Todos",
                        allTodos: "Show All Todos",
                    },
                    settings:{
                        account: {
                            title: "Account Management",
                            changePassword: {
                                title: "Change your Password",
                                currentPassword: "Enter your current Password",
                                newPassword: "Enter your new Password",
                                confirmPassword: "Confirm your new Password",
                                change: "Change Password",
                            },
                            changeEmail: {
                                title: "Change your E-Mail address",
                                currentEmail: "Enter your current E-Mail address",
                                newEmail: "Enter your new E-Mail address",
                                change: "Request your E-Mail address Change",
                            },
                            changeUsername: {
                                title: "Change Username",
                                currentUsername: "Enter your current Username",
                                newUsername: "Enter your new Username",
                                change: "Change your Username",
                            },
                        },
                        appearance: {
                            title: "Appearance Settings",
                            themeTitle: "Choose Your Theme",
                            options: {
                                default: "Default",
                                dark: "Dark",
                                light: "Light",
                                corporate: "Corporate",
                                aqua: "Aqua",
                            },
                        },
                    }
                    }
                }
            }
        }
    );

export default i18n;