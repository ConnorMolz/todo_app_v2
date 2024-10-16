import NavBar from "../Components/NavBar.tsx";
import { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { pocket_base } from "../lib/pocket_base.ts";
import { AuthModel } from "pocketbase";
import DOMPurify from "dompurify";
import {useTranslation} from "react-i18next";

const CreateTodo = () =>{
    // Translation
    const { t } = useTranslation();

    // Page variables
    const [ todoTitle, setTodoTitle ] = useState('');
    const [ todoDescription, setTodoDescription ] = useState('');
    const [ session, setSession ] = useState<AuthModel | null>(null);
    const [ hasTable, setHasTable ] = useState(false);
    const [ tableData, setTableData ] = useState<{ todo_item_title: string, todo_item_description: string, todo_item_done: boolean }[]>([]);
    const [ changeOnItem, setChangeOnItem ] = useState(false);
    const [ picture, setPicture ] = useState<File | null>(null);
    const [ hasImage, setHasImage ] = useState(false);
    const [ dueDate, setDueDate ] = useState<Date | null>(null);
    const [ hasDueDate, setHasDueDate ] = useState(false);
    const [ allWidgets, setAllWidgets ] = useState(false);
    const [ hasMoreUsers, setHasMoreUsers ] = useState(false);
    const [ users, setUsers ] = useState<string[]>([]);
    const [ inputColor, setInputColor ] = useState('input-neutral');
    const [ possibleUsers, setPossibleUsers ] = useState<string[]>([]);
    const [ userInput, setUserInput ] = useState('');
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

    // Hook for update the state of the widgets and check if the add button should be displayed
    useEffect(() => {
        checkForAllWidgets();
    }, [hasImage, hasDueDate, hasTable, hasMoreUsers]);

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
        if (dueDate){
            data.append("dueDate", dueDate.toString());
        }
        if(picture != null) {
            data.append("image", picture, "image.png");
        }
        if(users.length > 0) {
            for(let i = 0; i < users.length; i++) {
                data.append("user_id", await getUserId(users[i]));
            }
        }
        data.append("owner", session.id);

        // Add entry to the backend
        await pocket_base.collection('todos').create(data);

        // Navigate to the home page after check the session
        navigate("/");

    }

    const getUserId = async (email: string):Promise<string> => {
        // @ts-ignore is a pocket base error
        const records = await pocket_base.collection('users').getFullList();
        const user = records.find((record) => record.email === email);
        if(!user){
            throw new Error("User not found");
        }
        return user?.id;
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

    // Function for rendering the Image upload at creation
    const createFileUpload = (e:any) => {
        //Prevent reloading
        e.preventDefault();

        // Create image upload in the UI
        setHasImage(true);
    }

    // Function for rendering the due date field at creation
    const createDueDateFiled = (e:any) => {
        //Prevent reloading
        e.preventDefault();

        // Create due date field in the UI
        setHasDueDate(true);

    }

    // This function checks if all widgets are added
    // if yes will the button for adding widgets disappear
    const checkForAllWidgets = () => {
        setAllWidgets(hasTable && hasImage && hasDueDate && hasMoreUsers);
    }

    // Function for the search of users in the backend
    const getUsers = async (e:any) => {
        // prevent reloading
        e.preventDefault();

        // Activate the UI
        setHasMoreUsers(true);

        // Get all possible users
        // @ts-ignore is a pocket base error
        const records = await pocket_base.collection('users').getFullList({
            fields: ['email']
        });
        setPossibleUsers(records.map((record) => record.email));


    }

    useEffect(() => {
        console.log(possibleUsers);
    }, [possibleUsers]);

    const addUser = (e:any) => {
        // Prevent reloading
        e.preventDefault();
        // Check if the user input is empty
        if (userInput === '') {
            setInputColor('input-error');
            return;
        }
        // Check if requested user is existing if not throw error
        if (!possibleUsers.includes(userInput)) {
            setInputColor('input-error');
            return;
        }
        // Add user and clean up the input field
        setUsers([...users, userInput]);
        setInputColor('input-neutral');
        setUserInput('');
    }

    return(
        <div className="bg-base-100">
            <NavBar />
            <form>
                <div className="flex justify-center py-5">
                    <input
                        required={true}
                        type="text"
                        placeholder={t('todo.todoTitle')}
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
                        placeholder={t('todo.todoDescription')}
                        className="input input-bordered w-full max-w-xs h-full max-h-xs"
                        value={todoDescription}
                        onChange={(e) => {
                            setTodoDescription(e.target.value)
                        }}
                    />
                </div>
                { hasDueDate &&
                    <div className="flex justify-center py-5">
                        <input
                            type="date"
                            className="input input-bordered w-full max-w-xs"
                            // @ts-ignore Should be ignored because the value can be null
                            value={dueDate}
                            onChange={(e) => {
                                // @ts-ignore
                                setDueDate(e.target.value)
                            }}
                        />
                    </div>
                }
                {
                    !allWidgets &&
                    <div className="justify-center flex py-5">
                        <details className="dropdown">
                            <summary className="btn btn-neutral m-1">{t('todo.addWidget')}</summary>
                            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                {!hasDueDate && <li><button onClick={createDueDateFiled}>{t('addDueDate')}</button></li>}
                                {!hasTable && <li><button onClick={createTable}>{t('addList')}</button></li>}
                                {!hasImage && <li><button onClick={createFileUpload}>{t('todo.addImage')}</button></li>}
                                {!hasMoreUsers && <li><button onClick={getUsers}>{t('todo.addUsers')}</button></li>}
                            </ul>
                        </details>
                    </div>
                }
                {
                    hasTable &&
                    <div className="overflow-x-auto">
                        <table className="table table-zebra">
                            <thead>
                            <tr>
                                <th>{t('todo.itemName')}</th>
                                <th>{t('todo.itemDescription')}</th>
                                <th>{t('todo.itemDone')}</th>
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
                                        placeholder={t('todo.itemAddTitle')}
                                        className="input input-bordered w-full max-w-xs"
                                        value={itemTitle}
                                        onChange={(e) => setItemTitle(e.target.value)}
                                    />
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        placeholder={t('todo.itemAddDescription')}
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
                            <button className="btn btn-neutral px-5 mx-2" onClick={addItem}>{t('todo.addItem')}</button>
                        </div>

                    </div>

                }
                {hasImage &&
                <div className="flex justify-center py-5">
                    <input
                        type="file"
                        className="file-input file-input-bordered w-full max-w-xs"
                        accept="image/*"
                        onChange={(e) => {
                            if (e.target.files) {
                                const file = e.target.files[0];
                                if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) { // 5MB limit
                                    setPicture(file);
                                }
                            }
                        }}
                    />
                </div>
                }
                {
                    picture && (
                        <div className="pb-5">
                            <div className="flex justify-center py-5">
                                <img src={DOMPurify.sanitize(URL.createObjectURL(picture))} alt="Preview"
                                     className="w-1/2"/>
                            </div>
                            <div className="flex justify-center">
                                <div className="flex justify-center">
                                    <button className="btn btn-neutral px-5 mx-2" onClick={() => setPicture(null)}>
                                        {t('todo.removeImage')}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    hasMoreUsers &&
                    <div className="">

                        <div className="flex justify-center py-5">
                            <input
                                type="text"
                                placeholder={t('todo.enterUser')}
                                className={`input ${inputColor} w-full max-w-xs input-bordered`}
                                value={userInput}
                                onChange={(e) => {
                                    setUserInput(e.target.value)
                                }}
                            />
                            <button onClick={(e:any) => addUser(e)} className="btn btn-neutral px-5 mx-2">{t('todo.addUser')}</button>
                        </div>
                        <div className="flex justify-center py-5">
                            {
                                users.length > 0 &&
                                <div className="flex justify-center py-5">
                                    <div className="flex justify-center">
                                        <ul>
                                            {users.map((user) => (
                                                <li>{user}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                }
                <div className="flex justify-center">
                    <button className="btn btn-neutral px-5 mx-2" onClick={addTodo}>{t('todo.addTodo')}</button>
                    <Link className="btn btn-neutral px-5 mx-2" to={"/"}>{t('todo.cancel')}</Link>
                </div>
            </form>
        </div>
    )
}

export default CreateTodo;