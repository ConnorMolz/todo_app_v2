import NavBar from "../Components/NavBar.tsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pocket_base } from "../lib/pocket_base.ts";
import { AuthModel } from "pocketbase";

const CreateTodo = () =>{
    const [ todoTitle, setTodoTitle ] = useState('');
    const [ todoDescription, setTodoDescription ] = useState('');
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const navigate = useNavigate();

    useEffect(()=>{
        if(pocket_base.authStore.isValid){
            setSession(pocket_base.authStore.model)
        }
    },[]);

    const addTodo = async (e:any) =>{
        e.preventDefault();
        if(!session)return
        //@ts-ignore
        const data = {
            "todo_title": todoTitle,
            "todo_description": todoDescription,
            "user_id": session.id,
            "done": false,
            "table": null
        }

        pocket_base.collection('todos').create(data);
        navigate("/");


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