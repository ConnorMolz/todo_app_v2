import NavBar from "../Components/NavBar.tsx";
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { pocket_base } from "../lib/pocket_base.ts";
import { AuthModel } from "pocketbase";
import {invoke} from "@tauri-apps/api/core";

const CreateTodo = () =>{
    // Page variables
    const [ todoTitle, setTodoTitle ] = useState('');
    const [ todoDescription, setTodoDescription ] = useState('');
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const [ hasTable, setHasTable ] = useState(false);
    const [ tableData, setTableData ] = useState<{ todo_item_title: string, todo_item_description: string, todo_item_done: boolean }[]>([]);
    const navigate = useNavigate();

    // Modal (add Item to table) variables
    const [ itemTitle, setItemTitle ] = useState('');
    const [ itemDescription, setItemDescription ] = useState('');
    const [ itemDone, setItemDone ] = useState(false);

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
            "table": tableData
        }

        pocket_base.collection('todos').create(data);
        navigate("/");


    }

    const addItem = async (e:any) => {
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

        invoke("log_in_console", {text:"", text2:tableData}).then()

    }

    const createTable = (e:any) => {
        //Prevent reloading
        e.preventDefault();

        // Create table in the UI
        setHasTable(true);

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
                                                    item.todo_item_done = !item.todo_item_done
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
                                        value={itemTitle}
                                        onChange={(e) => setItemTitle(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder="Add the description of your list item"
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
                <div className="flex justify-center">
                    <button className="btn btn-neutral px-5 mx-2">Add Todo</button>
                    <Link className="btn btn-neutral px-5 mx-2" to={"/"}>Cancel</Link>
                </div>
            </form>
        </div>
    )
}

export default CreateTodo;