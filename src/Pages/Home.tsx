import { useEffect, useState } from "react";
import { createClient, Session } from "@supabase/supabase-js";
import NavBar from "../Components/NavBar.tsx";
import { Link } from 'react-router-dom';
import { invoke } from "@tauri-apps/api/core";

const supabase = createClient('https://jwxjbmsorwybofnzlvrh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp3eGpibXNvcnd5Ym9mbnpsdnJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDM2NTIsImV4cCI6MjAzOTU3OTY1Mn0.3t4P6liovQTg5p1eg8KKzLFYyswzN8gizi9QBEl8NQw')

const Home = () =>{
    const [ session, setSession ] = useState<Session | null>(null);
    const [ todos, setTodos ] = useState<{ id: any; todo: any; created_at: any; }[]>([])

    useEffect(()=>{
        supabase.auth.getSession().then(({data: {session} }) =>{
            setSession(session);
        });
    },[]);

    useEffect(() => {
        if (session) getTodos().then();
    },[session]);

    async function getTodos() {
        if(!session)setTimeout(() => getTodos(), 1000);
        // @ts-ignore
        supabase.from('todos').select("id, todo, created_at").eq('from', session.user.id).eq('done', false).then(({ data, error }) => {
            if (error) {
                invoke( "log_in_console", { text: error.message, text2:"getTodos" } );
                return;
            }
            console.log(data);
            setTodos(data);
        });
    }

    function markAsDone(id: any) {
        supabase.from('todos').update({ done: true }).eq('id', id).then(({ data, error }) => {
            if (error) {
                invoke( "log_in_console", { text: error.message, text2:"markAsDone" } ).then();
                return;
            }
            console.log(data);
            getTodos().then();

        });
    }

    function logout(){
        supabase.auth.signOut().then();
    }

    return(
        <div className="bg-base-100">
            <NavBar />
            <p>You are logged in as { session?.user.email }</p>
            <div>
                <button className="btn" onClick={ logout }>Button</button>
            </div>
            <div className="flex-1 justify-center py-12">
                {
                    todos.map((todo) => (
                        <div className='flex-row justify-between bg-neutral-600 p-5 m-5 rounded-lg'>
                            <Link to={`/edit/${todo.id}`}>
                                <div className=''>
                                    <div>
                                        <p className='text-neutral-100 text-xl'>{todo.todo}</p>
                                        <p className='text-neutral-300'>{new Date(todo.created_at).toLocaleString()}</p>
                                    </div>
                                </div>
                            </Link>
                            <button
                                className='btn btn-neutral '
                                title="Done"
                                onClick={() => {
                                markAsDone(todo.id)}}
                            >
                                Done
                            </button>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Home;