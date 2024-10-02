import { useEffect, useState } from "react";
import NavBar from "../Components/NavBar.tsx";
import { Link, useNavigate } from 'react-router-dom';
import { pocket_base } from "../lib/pocket_base.ts";
import { AuthModel, RecordModel } from "pocketbase";


const AllTodos = () =>{


    // Page Variables
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const [ todos, setTodos ] = useState<RecordModel | []>([])
    // Navigator for send back if the session is invalid
    const navigate = useNavigate();

    // Check the session if its invalid the user
    // get redirected to the Auth page
    useEffect(()=>{

        if(pocket_base.authStore.isValid){
            setSession(pocket_base.authStore.model);
        }
        else{
            navigate("/");
        }
    },[]);

    // After the session is set pull all todos
    useEffect(() => {
        if (session) getTodos().then();
    },[session]);

    // Get todos from backend
    async function getTodos() {
        // If the session is not set at this moment the app wait 1 Second and try it again
        if(!session)setTimeout(() => getTodos(), 1000);
        if(!session) return;
        // The query filter apply the filter at the backend, that the user only get his own todos
        const queryFilter = "user_id = \"" + session.id + "\"";
        // Pull and sort(by updated date) the data
        const data = await pocket_base.collection('todos').getFullList(
            {
                filter: queryFilter,
                sort: "-updated"
            }
        );
        // Set Page Data
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