import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar.tsx";
import { Link } from 'react-router-dom';
import { invoke } from "@tauri-apps/api/core";
import { supabase } from "../lib/supabase.ts";
import {pocket_base} from "../lib/pocket_base.ts";
import {AuthModel, RecordModel} from "pocketbase";


const Home = () =>{

    const [ session, setSession ] = useState<AuthModel | null>(null);
    const [ todos, setTodos ] = useState<RecordModel | []>([])

    useEffect(()=>{

        if(pocket_base.authStore.isValid){
            setSession(pocket_base.authStore.model);
        }
    },[]);

    useEffect(() => {
        if (session) getTodos().then();
    },[session]);

    async function getTodos() {
        if(!session)setTimeout(() => getTodos(), 1000);
        if(!session) return;
        const queryFilter = "user_id = \"" + session.id + "\"";
        const data = await pocket_base.collection('todos').getFullList(
            {
                filter: queryFilter,
            }
        );
        invoke("log_in_console", {text:data, text2:"data"});
        //@ts-ignore   TODO: update data type later in useState
        setTodos(data);

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
        pocket_base.authStore.clear();
    }

    return(
        <div className="bg-base-100">
            <NavBar />
            <p>You are logged in as {}</p>
            <div>
                <button className="btn" onClick={ logout }>Button</button>
            </div>
            <div className="flex-1 justify-center py-12">
                {
                    //@ts-ignore
                    todos.map((todo) => (
                        <div className='flex-row justify-between bg-neutral-600 p-5 m-5 rounded-lg'>
                            <Link to={`/edit/${todo.id}`}>
                                <div className=''>
                                    <div>
                                        <p className='text-neutral-100 text-xl'>{todo.todo_title}</p>
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