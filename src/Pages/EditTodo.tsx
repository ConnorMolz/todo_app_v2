import NavBar from "../Components/NavBar.tsx";
import { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { pocket_base } from "../lib/pocket_base.ts";
import { AuthModel } from "pocketbase";

const editTodo = () =>{

    // Page variables
    const [ todoTitle, setTodoTitle ] = useState('');
    const [ todoDescription, setTodoDescription ] = useState('');
    const [ hasTable, setHasTable ] = useState(false);
    const [ tableData, setTableData ] = useState<{ todo_item_title: string, todo_item_description: string, todo_item_done: boolean }[]>([]);
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const [ done, setDone ] = useState(false);
    const [ changeOnItem, setChangeOnItem ] = useState(false);
    const navigate = useNavigate();
    const { todo_id } = useParams();

    // New Item at table variables
    const [ itemTitle, setItemTitle ] = useState('');
    const [ itemDescription, setItemDescription ] = useState('');
    const [ itemDone, setItemDone ] = useState(false);

    // Check Session else redirect the user to the auth page
    useEffect(()=>{
        if(pocket_base.authStore.isValid){
            setSession(pocket_base.authStore.model);
            getTodo(todo_id).then();
        }
        else{
            navigate("/");
        }
    },[]);

    // Renderer for table item, if the done status is changed
    // Without this useEffect the page gets not rendered on change of
    // Item status change
    useEffect(() => {
        setChangeOnItem(false);
    }, [changeOnItem]);

    // Function, which pull the entry by ID from the backend
    async function getTodo(id :any) {
        // Pull the data
        const data = await pocket_base.collection("todos").getOne(id);

        // Set the Data into the page variables
        setTodoTitle(data.todo_title);
        setTodoDescription(data.todo_description);
        setDone(data.done);

        // Check if a table is already created and if not on table gets rendered
        if(data.table != null){
            setTableData(data.table);
            setHasTable(true);
        }


    }

    // Function, which update the entry at the backend
    const updateTodo = async (e:any) =>{
        // Prevent page reload
        e.preventDefault();

        // Return if session or todo_id is not set correctly
        if(!session)return;
        if(!todo_id) return;

        // Create data set for update in the backend
        //@ts-ignore
        const data = {
            "todo_title": todoTitle,
            "todo_description": todoDescription,
            "user_id": session.id,
            "done": done,
            "table": tableData
        }

        // Send update and navigate back to the Home Page
        pocket_base.collection("todos").update(todo_id, data);
        navigate("/");

    }

    // Update function for the status
    async function setStatus(newStatus:boolean){
        // Return if session or todo_id is not set correctly
        if(!session)return;
        if(!todo_id) return;

        // Create data set for update in the backend
        //@ts-ignore
        const data = {
            "todo_title": todoTitle,
            "todo_description": todoDescription,
            "user_id": session.id,
            "done": newStatus,
            "table": tableData
        }

        // Send update and navigate back to the Home Page
        pocket_base.collection("todos").update(todo_id, data);
        navigate("/");
    }

    // functions for set todos done and undone which
    // call the setStatus function with a different parameter
    function setTodoDone(e:any){
        e.preventDefault();
        setStatus(true).then();
    }

    function setTodoUndone(e:any){
        e.preventDefault();
        setStatus(false).then();
    }

    // Add Item to the table
    const addItem = (e:any) => {
        // Prevent page reloading
        e.preventDefault();

        // Get data from the new Item
        const itemData = {
            "todo_item_title": itemTitle,
            "todo_item_description": itemDescription,
            "todo_item_done": itemDone
        };

        // Add Item to the Array
        setTableData([...tableData, itemData]);

        // Cleanup the modal data
        setHasTable(true);
        setItemTitle('');
        setItemDescription('');
        setItemDone(false);

    }

    // Function for rendering the table at creation
    const createTable = (e:any) => {
        //Prevent reloading
        e.preventDefault();

        // Create table in the UI
        setHasTable(true);

    }

    return(
        <div className="bg-base-100">
            <NavBar/>
            <form>
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
                    <textarea
                        rows={6}
                        placeholder="Your Todo Content"
                        className="input input-bordered w-full max-w-xs h-full max-h-xs"
                        value={todoDescription}
                        onChange={(e) => {
                            setTodoDescription(e.target.value)
                        }}
                    />
                </div>
                {
                    !hasTable &&
                    <div className="flex justify-center py-5">
                        <button className="btn btn-neutral px-5 mx-2" onClick={createTable}>Add Table</button>
                    </div>
                }
                {
                    hasTable &&
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                            <tr>
                                <th>Todo Item</th>
                                <th>Description</th>
                                <th>Done</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                tableData.map((item) => (
                                    <tr>
                                        <td>{item.todo_item_title}</td>
                                        <td>{item.todo_item_description}</td>
                                        <td>
                                            <input
                                                type="checkbox"
                                                checked={item.todo_item_done}
                                                className="checkbox"
                                                onClick={() => {
                                                    item.todo_item_done = !item.todo_item_done;
                                                    setChangeOnItem(true);
                                                }}
                                            />
                                        </td>
                                    </tr>
                                ))
                            }
                            <tr>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Add the title of your list item"
                                        className="input input-bordered w-full max-w-xs"
                                        value={itemTitle}
                                        onChange={(e) => setItemTitle(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Add the description of your list item"
                                        className="input input-bordered w-full max-w-xs"
                                        value={itemDescription}
                                        onChange={(e) => setItemDescription(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="checkbox"
                                        className="checkbox"
                                        checked={itemDone}
                                        onChange={(e) => setItemDone(e.target.checked)}
                                    />
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        <div className="flex justify-center py-5">
                            <button className="btn btn-neutral px-5 mx-2" onClick={addItem}>Add item</button>
                        </div>

                    </div>

                }
                <div className="flex justify-center py-5">
                    <button className="btn btn-neutral px-5 mx-2" onClick={updateTodo}>Update Todo</button>
                    <Link className="btn btn-neutral px-5 mx-2" to={"/"}>Cancel</Link>
                    { !done && <button className="btn btn-neutral px-5 mx-2" onClick={setTodoDone}>Set Done</button>}
                    { done && <button className="btn btn-neutral px-5 mx-2" onClick={setTodoUndone}>Set Undone</button>}
                </div>
            </form>
            <div className="justify-center">

            </div>
        </div>
    )
}

export default editTodo;