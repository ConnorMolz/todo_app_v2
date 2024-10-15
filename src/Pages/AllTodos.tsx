import {JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState} from "react";
import NavBar from "../Components/NavBar.tsx";
import { Link, useNavigate } from 'react-router-dom';
import { pocket_base } from "../lib/pocket_base.ts";
import { AuthModel, RecordModel } from "pocketbase";


const AllTodos = () =>{


    // Page Variables
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const [ loading, setLoading ] = useState(true);
    const [ todos, setTodos ] = useState<RecordModel | []>([])
    const [ filterForOwnTodos, setFilterForOwnTodos ] = useState(false);
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
        if (session) {
            setLoading(true);
            getTodos().then(() => {setLoading(false)});
        }
    }, [session, filterForOwnTodos]);

    // Get todos from backend
    async function getTodos() {
        // If the session is not set at this moment the app wait 1 Second and try it again
        if(!session)setTimeout(() => getTodos(), 1000);
        if(!session) return;
        // The query filter apply the filter at the backend, that the user only get his own todos
        let queryFilter:string;
        if(filterForOwnTodos) {
            queryFilter = "user_id ?~ \"" + session.id + "\" && owner = \"" + session.id + "\"";
        }
        else {
            queryFilter = "user_id ?~ \"" + session.id + "\"";
        }
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
            <NavBar/>
            <div className="dropdown dropdown-hover dropdown-end justify-end flex">
                <div tabIndex={0} role="button" className="btn btn-ghost m-1">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        className="inline-block h-5 w-5 stroke-current">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
                    </svg>
                </div>
                <ul tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    <li>
                        <button
                            className="hover"
                            onClick={() => setFilterForOwnTodos(!filterForOwnTodos)}
                        >
                            {filterForOwnTodos ? 'Show All Todos' : 'Show Only My Todos'}
                        </button>
                    </li>
                </ul>
            </div>
            <div className="flex-1 justify-center">
                {!loading &&

                    todos.map((todo: {
                        id: any;
                        todo_title: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined;
                        updated: string | number | Date;
                        dueDate: string | number | Date;
                    }) => (
                        <div className='flex-row justify-between bg-base-200 p-5 m-5 rounded-lg'>
                            <Link to={`/edit/${todo.id}`}>
                                <div className=''>
                                    <div>
                                        <p className='text-xl'>{todo.todo_title}</p>
                                        <p className=''>Last Update: {new Date(todo.updated).toLocaleString()}</p>
                                        <p className=''>{todo.dueDate && "Due: " + new Date(todo.dueDate).toDateString()}</p>
                                    </div>
                                </div>
                            </Link>

                        </div>
                    ))
                }
                {loading && <div className="skeleton h-32 w-full"></div>}
            </div>
        </div>
    )
}

export default AllTodos;