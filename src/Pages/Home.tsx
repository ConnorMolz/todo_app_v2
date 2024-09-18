import {useEffect, useState} from "react";
import {createClient, Session} from "@supabase/supabase-js";

const supabase = createClient('https://jwxjbmsorwybofnzlvrh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eGpibXNvcnd5Ym9mbnpsdnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDM2NTIsImV4cCI6MjAzOTU3OTY1Mn0.3t4P6liovQTg5p1eg8KKzLFYyswzN8gizi9QBEl8NQw')

const Home = () =>{
    const [ session, setSession ] = useState<Session | null>(null);

    useEffect(()=>{
        supabase.auth.getSession().then(({data: {session} }) =>{
            setSession(session)
        })
    })

    function logout(){
        supabase.auth.signOut().then();
    }

    return(
        <div>
            <p>You are logged in as {session?.user.email}</p>
            <div>
                <button className="btn" onClick={logout}>Button</button>
            </div>
        </div>
    )
}

export default Home;