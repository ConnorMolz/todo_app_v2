import NavBar from "../Components/NavBar.tsx";
import {useEffect, useState} from "react";
import {Session} from "@supabase/supabase-js";
import {useNavigate, useParams} from "react-router-dom";
import {supabase} from "../lib/supabase.ts";
import {invoke} from "@tauri-apps/api/core";

const editTodo = () =>{

    const [ todoTitle, setTodoTitle ] = useState('');
    const [ todoDescription, setTodoDescription ] = useState('');
    const [ session, setSession ] = useState<Session | null>(null);
    const navigate = useNavigate();
    const { todo_id } = useParams();
    invoke("log_in_console", { text:todo_id , text2:"" } ).then();


    useEffect(()=>{
        supabase.auth.getSession().then( async( { data: {session} } ) =>{
            setSession(session);
            // @ts-ignore
            await getTodo(todo_id);
        });
    },[]);

    async function getTodo(id :number) {
        const { data, error } = await supabase.from('todos').select('todo, description, table').eq('id', id);
        if (error) {
            await invoke("log_in_console", {text: error.message, text2: "getTodo"});
            return '';
        }
        console.log(data);
        setTodoTitle(data[0].todo);
        setTodoDescription(data[0].description);
    }

    const updateTodo = async (e:any) =>{
        e.preventDefault();
        //@ts-ignore
        supabase.from('todos').update({ todo: todoTitle, description: todoDescription })
            .eq('id', todo_id).eq("from", session?.user.id)
            .then(({ data, error }) => {
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
            <NavBar/>
            <form onSubmit={updateTodo}>
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
                    <button className="btn btn-neutral">Update Todo</button>
                </div>
            </form>
        </div>
    )
}

export default editTodo;