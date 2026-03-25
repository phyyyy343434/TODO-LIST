import React, { useState, useEffect } from "react";
import Place from "./Place";
import SideBar from "./SideBar";

function Home() {
  // states
  const [view, setView] = useState("Home");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [myGroups, setMyGroups] = useState(null);
  const [current, setCurrent] = useState("");

  // loading data 
  useEffect(() => {
    var data = localStorage.getItem("my-todo-groups");
    var active = localStorage.getItem("my-active-group");

    if (data == null) {
        // default data
        var def = {
            "My Board": {
                Task: [], 
                "Back-Log": [], 
                Doing: [], 
                Done: [], 
                Confirm: []
            }
        };
        setMyGroups(def);
    } else {
        setMyGroups(JSON.parse(data));
    }

    if (active == null) {
        setCurrent("My Board");
    } else {
        setCurrent(active);
    }
  }, []);

  // saving data
  useEffect(() => {
      if (myGroups != null) {
        // console.log("saving groups...");
        localStorage.setItem("my-todo-groups", JSON.stringify(myGroups));
      }
  }, [myGroups]);

  useEffect(() => {
      if (current != "") {
        localStorage.setItem("my-active-group", current);
      }
  }, [current]);


  function addGroup(name) {
      if (name != "") {
          if (myGroups[name] == undefined) {
             var temp = { ...myGroups };
             temp[name] = { 
                Task: [], 
                "Back-Log": [], 
                Doing: [], 
                Done: [], 
                Confirm: [] 
             };
             setMyGroups(temp);
             setCurrent(name);
          } else {
              alert("Name exists!");
          }
      }
  }

  function changeName(oldName, newName) {
      var fixedName = newName.trim();
      if (fixedName != "") {
          if (myGroups[fixedName] == undefined) {
              var temp = { ...myGroups };
              var data = temp[oldName]; // save old data
              temp[fixedName] = data;   // move to new
              delete temp[oldName];     // delete old
              
              setMyGroups(temp);
              
              if (current == oldName) {
                  setCurrent(fixedName);
              }
          }
      }
  }

  function removeGroup(name) {
      var keys = Object.keys(myGroups);
      if (keys.length > 1) {
          var temp = { ...myGroups };
          delete temp[name];
          setMyGroups(temp);

          if (current == name) {
              // go to the first one available
              var first = Object.keys(temp)[0];
              setCurrent(first);
          }
      } else {
          alert("Cannot delete last one");
      }
  }

  // update tasks function
  function updateTasks(val) {
      var temp = { ...myGroups };
      var currentTasks = temp[current];
      
      // check if it is function or value
      if (typeof val === 'function') {
          temp[current] = val(currentTasks);
      } else {
          temp[current] = val;
      }
      setMyGroups(temp);
  }

  // loading check
  if (myGroups == null) {
      return <div>Loading...</div>;
  }

  // get data safely
  var dataToShow = myGroups[current];
  if (dataToShow == undefined) {
      dataToShow = { Task: [], "Back-Log": [], Doing: [], Done: [], Confirm: [] };
  }

  return (
    <div className="flex w-full min-h-screen bg-transparent overflow-hidden relative">
      <SideBar 
        view={view} 
        changeView={setView}
        curr={current}
        setCurr={setCurrent}
        list={Object.keys(myGroups)} 
        add={addGroup}
        edit={changeName}
        del={removeGroup}
        isOpen={mobileOpen}
        setOpen={setMobileOpen}
      />
      
      <Place 
        view={view} 
        tasks={dataToShow} 
        setTasks={updateTasks}
        groupId={current} 
        menuClick={function() { setMobileOpen(true); }}
      />
    </div>
  );
}

export default Home;