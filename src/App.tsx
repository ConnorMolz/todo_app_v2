import './App.css'
import { useState, useEffect } from 'react'
import { pocket_base } from "./lib/pocket_base.ts";
import { invoke } from "@tauri-apps/api/core";
import LogInHeader from "./Components/LogInHeader.tsx";
import { Form, useNavigate } from "react-router-dom";

export default function App() {
    const [session, setSession] = useState<boolean>(false)
    const [loading, setLoading] = useState(true)
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const navigator = useNavigate();

    async function signInWithEmail(e:any) {
        e.preventDefault();

        //@ts-ignore
        const login = await pocket_base.collection("users").authWithPassword(
            email,
            password,
        );

        // @ts-ignore
        invoke("log_in_console", {text:pocket_base.authStore.model.id, text2:"Test"}).then();

        setSession(true);

    }

    useEffect(() => {
        setLoading(true);
        setSession(pocket_base.authStore.isValid);
        setLoading(false);

    }, [])

    if(loading){
        return (
            <div className="skeleton h-32 w-32"></div>
        )
    }

    if (session && !loading) {
        navigator("/Home");
    }
    else {
        return (
            <div className="min-h-screen">
                <LogInHeader />
                <Form onSubmit={signInWithEmail} className="">
                    <div className="flex justify-center py-5">
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"/>
                                <path
                                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"/>
                            </svg>
                            <input
                                type="text"
                                className="grow"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required={true}
                            />
                        </label>
                    </div>
                    <div className="flex justify-center py-5">
                        <label className="input input-bordered flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fill-rule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clip-rule="evenodd"/>
                            </svg>
                            <input
                                type="password"
                                className="grow"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required={true}
                            />
                        </label>
                    </div>
                    <div className="flex justify-center">
                        <button className="btn btn-neutral">Log In</button>
                    </div>
                </Form>
            </div>
        );
    }
}