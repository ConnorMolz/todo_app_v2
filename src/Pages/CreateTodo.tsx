import NavBar from "../Components/NavBar.tsx";
import { useEffect, useState } from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase.ts";
import { useNavigate } from "react-router-dom";
import { invoke } from "@tauri-apps/api/core";

const CreateTodo = () =>{
    const [ todoTitle, setTodoTitle ] = useState('');
    const [ todoDescription, setTodoDescription ] = useState('');
    const [ session, setSession ] = useState<Session | null>(null);
    const navigate = useNavigate();

    useEffect(()=>{
        supabase.auth.getSession().then(({data: {session} }) =>{
            setSession(session);
        });
    },[]);

    const addTodo = async (e:any) =>{
        e.preventDefault();
        //@ts-ignore
        supabase.from('todos').insert({ todo: todoTitle, from: session.user.id, description: todoDescription }).then(({ data, error }) => {
            if (error) {
                invoke( "log_in_console", { text: error.message, text2:"addTodo" } );
                return;
            }
            invoke( "log_in_console", { text: data, text2: "addTodo success"});
            navigate("/");
        })


    }

    return(
        <div className="bg-base-100">
            <NavBar />
            <form onSubmit={addTodo}>
                <div className="flex justify-center py-5">
                    <input
                        required={true}
                        type="text"
                        placeholder="Your Todo title"
                        className="input input-bordered w-full max-w-xs"
                        value={todoTitle}
                        onChange={(e) => {
                            setTodoTitle(e.target.value)
                        }}
                    />
                </div>
                <div className="flex justify-center py-5">
                    <input
                        type="text"
                        placeholder="Your Todo Content"
                        className="input input-bordered w-full max-w-xs"
                        value={todoDescription}
                        onChange={(e) => {
                            setTodoDescription(e.target.value)
                        }}
                    />
                </div>
                <div className="flex justify-center">
                    <button className="btn btn-neutral">Add Todo</button>
                </div>
            </form>
        </div>
    )
}

export default CreateTodo;