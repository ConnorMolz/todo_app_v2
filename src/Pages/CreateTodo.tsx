import NavBar from "../Components/NavBar.tsx";
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { pocket_base } from "../lib/pocket_base.ts";
import { AuthModel } from "pocketbase";

const CreateTodo = () =>{
    // Page variables
    const [ todoTitle, setTodoTitle ] = useState('');
    const [ todoDescription, setTodoDescription ] = useState('');
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const [ hasTable, setHasTable ] = useState(false);
    const [ tableData, setTableData ] = useState<{ todo_item_title: string, todo_item_description: string, todo_item_done: boolean }[]>([]);
    const [ changeOnItem, setChangeOnItem ] = useState(false);
    const [ picture, setPicture ] = useState<File | null>(null);
    const navigate = useNavigate();

    // New Item at table variables
    const [ itemTitle, setItemTitle ] = useState('');
    const [ itemDescription, setItemDescription ] = useState('');
    const [ itemDone, setItemDone ] = useState(false);

    // Check Session else redirect the user to the auth page
    useEffect(()=>{
        if(pocket_base.authStore.isValid){
            setSession(pocket_base.authStore.model)
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

    // Function, which add the new entry at the backend
    const addTodo = async (e:any) =>{
        // Prevent page reloading
        e.preventDefault();

        // If session is not set return
        if(!session)return

        // Dataset for the backend
        const data = new FormData();
        data.append("todo_title", todoTitle);
        data.append("todo_description", todoDescription);
        data.append("user_id", session.id);
        data.append("done", "false");
        data.append("table", JSON.stringify(tableData));
        if(picture != null) {
            data.append("image", picture, "image.png");
        }

        // Add entry to the backend
        await pocket_base.collection('todos').create(data);

        // Navigate to the home page after check the session
        navigate("/");

    }

    // Add Item to table
    const addItem = async (e:any) => {
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
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full max-w-xs"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files) {
                                setPicture(e.target.files[0]);
                            }
                        }}
                    />
                </div>
                {
                    picture && (
                    <div className="pb-5">
                        <div className="flex justify-center py-5">
                            <img src={URL.createObjectURL(picture)} alt="Preview" className="w-1/2" />
                        </div>
                        <div className="flex justify-center">
                            <div className="flex justify-center">
                                <button className="btn btn-neutral px-5 mx-2" onClick={() => setPicture(null)}>Remove Image</button>
                            </div>
                        </div>
                    </div>
                    )
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