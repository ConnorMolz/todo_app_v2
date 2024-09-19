import './App.css'
import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import Auth from "./Pages/Auth.tsx";
import Home from "./Pages/Home.tsx";
import { supabase } from "./lib/supabase.ts";

export default function App() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
        setLoading(false)
        return () => subscription.unsubscribe()
    }, [])

    if(loading){
        return (
            <div className="skeleton h-32 w-32"></div>
        )
    }

    if (session && !loading) {
        return (<Home></Home>)
    }
    else {
        return (
            //<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
            <Auth />
        )
    }
}