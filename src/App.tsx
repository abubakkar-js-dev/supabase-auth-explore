import { ChangeEvent, useEffect, useState } from "react";
import "./App.css";
import { Auth } from "./components/auth";
import TaskManager from "./components/task-manager";
import { supabase } from "./supabase-client";
import type { Session } from "@supabase/supabase-js";



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

  const [session, setSession] = useState<Session | null>(null);


  const fetchSession = async ():Promise<void>=>{
    const currectSession = await supabase.auth.getSession();
    setSession(currectSession.data.session);
  }

  const logout = async ():Promise<void>=>{
     await supabase.auth.signOut();
     setSession(null);
  }

  useEffect(()=>{
    fetchSession();

    const {data: authListener} = supabase.auth.onAuthStateChange((_event,session)=>{
      setSession(session);
    })

    return ()=>{
      authListener.subscription.unsubscribe();
    }

  },[])

  console.log(session, "Session in App.tsx");





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
      {session ? (
        <>
        <button onClick={logout}>Log Out</button>
        <TaskManager  session={session}/>
      
        </>
      ): (<Auth />)}

    </>
  );
}

export default App;
