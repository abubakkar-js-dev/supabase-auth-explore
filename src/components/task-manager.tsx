import { ChangeEvent, useEffect, useState } from "react";
import { supabase } from "../supabase-client";
import { Session } from "@supabase/supabase-js";

interface Task {
  id: number;
  title: string;
  description: string;
  created_at: string;
  image_url: string;
}

function TaskManager({ session }: { session: Session | null }) {
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    created_by: "",
  });
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newDescription, setNewDescription] = useState<{
    [key: number]: string;
  }>({});

  const [taskImage, setTaskImage] = useState<File | null >(null)
  // console.log(newDescription, "New Description");

  // console.log(newTask, "Task");
  // console.log(tasks, "Tasks List");
  // console.log('User Email:', session?.user.email);

  const handleNewDescriptionChange = (id: number, value: string) => {
    setNewDescription((prev) => ({ ...prev, [id]: value }));
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileName = `${Date.now()}_${file.name}`;
    const {error} = await supabase.storage.from('tasks-images').upload(fileName, file);

    if(error){
      console.error("Error uploading image: ", error.message);
      return null;
    }

    const {data} = supabase.storage.from('tasks-images').getPublicUrl(fileName);

    return data.publicUrl;
  }

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    let imageUrl: string | null = null;

    if(taskImage){
      imageUrl = await uploadImage(taskImage);
    }

    const task = { ...newTask, created_by: session?.user.email, image_url: imageUrl };

    const { error } = await supabase.from("tasks").insert(task).single();

    if (error) {
      console.error("Error adding task: ", error.message);
      return;
    }
    setNewTask({ title: "", description: "", created_by: "" });
    console.log("Task added successfully");
    fetchTasks();
  };

  const fetchTasks = async () => {
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Error fetching tasks: ", error.message);
      return;
    }
    setTasks(data);
  };

  const deleteTask = async (id: number) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      console.log("Error deleting task: ", error.message);
      return;
    }
    fetchTasks();
    console.log("Task deleted successfully");
  };

  const updateTask = async (id: number) => {
    const { error } = await supabase
      .from("tasks")
      .update({ description: newDescription[id] })
      .eq("id", id);

    if (error) {
      console.log("Error updating task: ", error.message);
      return;
    }
    setNewDescription({});
    fetchTasks();
    console.log("Task updated successfully");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) =>{
    const files = e.target.files;
    if(files && files.length > 0){
      setTaskImage(files[0]);
    }else{
      setTaskImage(null);
    }
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    const channel = supabase.channel("task-channel");

    channel
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tasks" },
        (payload) => {
          const newTask = payload.new as Task;
          setTasks((prev) => [...prev, newTask]);
          // fetchTasks();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Task Manager CRUD</h2>

      {/* Form to add a new task */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Task Title"
          required
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, title: e.target.value }))
          }
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <textarea
          placeholder="Task Description"
          required
          onChange={(e) =>
            setNewTask((prev) => ({ ...prev, description: e.target.value }))
          }
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />

        <input type="file" accept="image/*" onChange={handleFileChange} />

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
                  value={newDescription[task.id] || ""}
                  placeholder="Updated description..."
                  onChange={(e) =>
                    handleNewDescriptionChange(task.id, e.target.value)
                  }
                />
                <button
                  style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}
                  onClick={() => updateTask(task.id)}
                >
                  Edit
                </button>
                <button
                  style={{ padding: "0.5rem 1rem" }}
                  onClick={() => deleteTask(task.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
