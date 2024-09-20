import NavBar from "../Components/NavBar.tsx";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { pocket_base } from "../lib/pocket_base.ts";
import { AuthModel } from "pocketbase";

const editTodo = () =>{

    const [ todoTitle, setTodoTitle ] = useState('');
    const [ todoDescription, setTodoDescription ] = useState('');
    const [ table, setTable ] = useState();
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const navigate = useNavigate();
    const { todo_id } = useParams();


    useEffect(()=>{
        if(pocket_base.authStore.isValid){
            setSession(pocket_base.authStore.model);
            getTodo(todo_id).then();
        }
        else{
            navigate("/");
        }
    },[]);

    async function getTodo(id :any) {
        const data = await pocket_base.collection("todos").getOne(id);
        console.log(data);
        setTodoTitle(data.todo_title);
        setTodoDescription(data.todo_description);
        setTable(data.table);

    }

    const updateTodo = async (e:any) =>{
        e.preventDefault();
        e.preventDefault();
        if(!session)return;
        if(!todo_id) return;
        //@ts-ignore
        const data = {
            "todo_title": todoTitle,
            "todo_description": todoDescription,
            "user_id": session.id,
            "done": false,
            "table": table
        }

        pocket_base.collection("todos").update(todo_id, data);
        navigate("/");

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