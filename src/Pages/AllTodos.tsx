import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar.tsx";
import { Link } from 'react-router-dom';
import {pocket_base} from "../lib/pocket_base.ts";
import {AuthModel, RecordModel} from "pocketbase";


const AllTodos = () =>{

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
        //@ts-ignore   TODO: update data type later in useState
        setTodos(data);

    }

    return(
        <div className="bg-base-100">
            <NavBar />
            <div className="flex-1 justify-center py-12">
                {
                    //@ts-ignore
                    todos.map((todo) => (
                        <div className='flex-row justify-between bg-neutral-600 p-5 m-5 rounded-lg'>
                            <Link to={`/edit/${todo.id}`}>
                                <div className=''>
                                    <div>
                                        <p className='text-neutral-100 text-xl'>{todo.todo_title}</p>
                                        <p className='text-neutral-300'>{new Date(todo.created).toLocaleString()}</p>
                                    </div>
                                </div>
                            </Link>

                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default AllTodos;