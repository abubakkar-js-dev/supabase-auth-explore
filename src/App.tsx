import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import TaskManager from "./components/task-manager";
import { supabase } from "./supabase-client";

interface Task {
  id: number,
  title: string,
  description: string,
  created_at: string,
  image_url: string
}

function App() {
  // const [session, setSession] = useState<any>(null);

  // const fetchSession = async () => {
  //   const currentSession = await supabase.auth.getSession();
  //   console.log(currentSession);
  //   setSession(currentSession.data.session);
  // };

  // useEffect(() => {
  //   fetchSession();

  //   const { data: authListener } = supabase.auth.onAuthStateChange(
  //     (_event, session) => {
  //       setSession(session);
  //     }
  //   );

  //   return () => {
  //     authListener.subscription.unsubscribe();
  //   };
  // }, []);

  // const logout = async () => {
  //   await supabase.auth.signOut();
  // };



  /// start 

  const [newTask, setNewTask] = useState({title: '', description: ''});
  const [tasks, setTasks] = useState<Task[]>([]);

  console.log(newTask,'Task')
  console.log(tasks,'Tasks List')

  const handleSubmit =  async(e: ChangeEvent<HTMLFormElement>) =>{
    e.preventDefault();

  const {error} =   await supabase.from('tasks').insert(newTask).single();

  if(error){
    console.error("Error adding task: ", error.message);
    return;
  }
   setNewTask({title: '', description: ''});
   console.log('Task added successfully');
  }

  const fetchTasks = async () =>{
    const {data,error} = await supabase.from('tasks').select('*').order('created_at',{ascending: false});

    if(error){
      console.log("Error fetching tasks: ", error.message);
      return;
    }
    setTasks(data);
  }

  useEffect(()=>{
    fetchTasks();
  },[]);


  return (
    <>
      {/* {session ? (
        <>
          <button onClick={logout}> Log Out</button>
          <TaskManager session={session} />
        </>
      ) : (
        <Auth />
      )} */}



       <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Task Manager CRUD</h2>

      {/* Form to add a new task */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Task Title"
          required
          onChange={(e)=> setNewTask((prev)=>({...prev, title: e.target.value}))}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <textarea
          placeholder="Task Description"
          required
          onChange={(e)=> setNewTask((prev)=>({...prev, description: e.target.value}))}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />

        {/* <input type="file" accept="image/*" onChange={handleFileChange} /> */}

        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Add Task
        </button>
      </form>

      {/* List of Tasks */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((task, key) => (
          <li
            key={key}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <img src={task.image_url} style={{ height: 70 }} />
              <div>
                <textarea
                  placeholder="Updated description..."
                  // onChange={(e) => setNewDescription(e.target.value)}
                />
                <button
                  style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
                  // onClick={() => updateTask(task.id)}
                >
                  Edit
                </button>
                <button
                  style={{ padding: "0.5rem 1rem" }}
                  // onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
    </>
  );
}

export default App;
