import './App.css'
import { useState, useEffect } from 'react'
import {createClient, Session} from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import Home from "./Pages/Home.tsx";

const supabase = createClient('https://jwxjbmsorwybofnzlvrh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eGpibXNvcnd5Ym9mbnpsdnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDM2NTIsImV4cCI6MjAzOTU3OTY1Mn0.3t4P6liovQTg5p1eg8KKzLFYyswzN8gizi9QBEl8NQw')

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
        return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />)
    }
}