import NavBar from "../Components/NavBar.tsx";
import { useEffect, useState } from "react";
import {Link, useNavigate, useParams} from "react-router-dom";
import { pocket_base } from "../lib/pocket_base.ts";
import { AuthModel } from "pocketbase";
import DOMPurify from "dompurify";

const editTodo = () =>{

    // Page variables
    const [ todoTitle, setTodoTitle ] = useState('');
    const [ todoDescription, setTodoDescription ] = useState('');
    const [ hasTable, setHasTable ] = useState(false);
    const [ tableData, setTableData ] = useState<{ todo_item_title: string, todo_item_description: string, todo_item_done: boolean }[]>([]);
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const [ done, setDone ] = useState(false);
    const [ changeOnItem, setChangeOnItem ] = useState(false);
    const [ picture, setPicture ] = useState<File | null>(null);
    const [ dueDate, setDueDate ] = useState<Date | null>(null);


    const [ pictureName, setPictureName ] = useState('');
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
        setDueDate(data.dueDate);

        // Check if a table is already created and if not on table gets rendered
        if(data.table != null){
            setTableData(data.table);
            setHasTable(true);
        }
        console.log(data);
        // If the backend delivers an image, the image will be loaded
        // reference: Pocket base Documentation
        if(data.image){
            // Set picture name for eventual deletion later
            setPictureName(data.image);

            // Get a token for File Access
            const fileToken = await pocket_base.files.getToken();

            // Get with the token the direct URL for the image
            const imageUrl = pocket_base.files.getUrl(data, data.image, {token: fileToken});

            // Get request for the Image
            const request = await fetch(imageUrl);
            //@ts-ignore is needed by type Script because this endpoint will
            // return always an image file
            setPicture(await request.blob());
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
        const data = new FormData();
        data.append("todo_title", todoTitle);
        data.append("todo_description", todoDescription);
        data.append("user_id", session.id);
        data.append("done", done.toString());
        data.append("table", JSON.stringify(tableData));
        if (dueDate){
            data.append("dueDate", dueDate?.toString());
        }
        if(picture != null) {
            data.append("image", picture, "image.png");
        }else{
            // Pocket base will so delete the picture
            data.append("image-", pictureName);
        }

        // Send update and navigate back to the Home Page
        await pocket_base.collection("todos").update(todo_id, data);
        navigate("/");

    }

    // Update function for the status
    async function setStatus(newStatus:boolean){
        // Return if session or todo_id is not set correctly
        if(!session)return;
        if(!todo_id) return;

        // Create data set for update in the backend
        //@ts-ignore
        const data = new FormData();
        data.append("todo_title", todoTitle);
        data.append("todo_description", todoDescription);
        data.append("user_id", session.id);
        data.append("done", newStatus.toString());
        data.append("table", JSON.stringify(tableData));
        if (dueDate){
            data.append("dueDate", dueDate?.toString());
        }
        else {
            data.append("dueDate", "");
        }
        if(picture != null) {
            data.append("image", picture, "image.png");
        }
        else{
            // Pocket base will so delete the picture
            data.append("image-", pictureName);
        }

        // Send update and navigate back to the Home Page
        await pocket_base.collection("todos").update(todo_id, data);
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

    // Check if the image file is an image
    const validateFile = (file: File): boolean => {
        const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        // If File is invalid return an error and cancel the loading process
        if (!validTypes.includes(file.type)) {
            alert('Invalid file type. Please upload an image file (jpeg, png, gif).');
            return false;
        }
        if (file.size > maxSize) {
            alert('File size exceeds the limit of 5MB.');
            return false;
        }
        return true;
    };

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
                <div className="flex justify-center py-5">
                    <input
                        type="datetime-local"
                        placeholder="Enter the due date (optional)"
                        className="input input-bordered w-full max-w-xs"
                        // @ts-ignore Should be ignored because the value can be null
                        value={dueDate}
                        onChange={(e) => {
                            // @ts-ignore
                            setDueDate(e.target.value)
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
                            if (e.target.files && validateFile(e.target.files[0])) {
                                setPicture(e.target.files[0]);
                            }
                        }}
                    />
                </div>
                {
                    picture && (
                        <div className="pb-5">
                            <div className="flex justify-center py-5">
                                <img src={DOMPurify.sanitize(URL.createObjectURL(picture))} alt="Preview"
                                     className="w-1/2"/>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex justify-center">
                                    <button className="btn btn-neutral px-5 mx-2" onClick={() => setPicture(null)}>Remove
                                        Image
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
                <div className="flex justify-center py-5">
                    <button className="btn btn-neutral px-5 mx-2" onClick={updateTodo}>Update Todo</button>
                    <Link className="btn btn-neutral px-5 mx-2" to={"/"}>Cancel</Link>
                    {!done && <button className="btn btn-neutral px-5 mx-2" onClick={setTodoDone}>Set Done</button>}
                    {done && <button className="btn btn-neutral px-5 mx-2" onClick={setTodoUndone}>Set Undone</button>}
                </div>
            </form>
            <div className="justify-center">

            </div>
        </div>
    )
}

export default editTodo;