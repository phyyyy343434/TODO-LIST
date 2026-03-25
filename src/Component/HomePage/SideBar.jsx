import React, { useState } from 'react';
import { IoIosAddCircle } from "react-icons/io";
import { MdFolder, MdFolderOpen, MdEdit, MdDelete, MdCheckCircle, MdCancel, MdClose } from "react-icons/md";

function SideBar(props) {
  // props
  const groups = props.list;
  const activeView = props.view;
  const activeGroup = props.curr;
  
  const [newName, setNewName] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [tempName, setTempName] = useState("");

  function submitNew() {
      if (newName != "") {
          props.add(newName);
          setNewName("");
      }
  }

  function beginEdit(e, gName) {
      e.stopPropagation();
      setEditTarget(gName);
      setTempName(gName);
  }

  function finishEdit(e) {
      e.stopPropagation();
      props.edit(editTarget, tempName);
      setEditTarget(null);
  }

  function clickDelete(e, gName) {
      e.stopPropagation();
      var ans = window.confirm("Delete " + gName + "?");
      if (ans == true) {
          props.del(gName);
      }
  }

  function handleMenuClick(itemName) {
      props.changeView(itemName);
      if (window.innerWidth < 768) {
          props.setOpen(false);
      }
  }

  function handleGroupClick(gName) {
      if (editTarget == null) {
          props.setCurr(gName);
          if (window.innerWidth < 768) {
              props.setOpen(false);
          }
      }
  }

  return (
    <>
      {props.isOpen ? (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => props.setOpen(false)}
        />
      ) : null}
      
      <div className={`
          fixed md:static inset-y-0 left-0 z-30
          w-64 bg-gray-900 text-white p-4 flex flex-col gap-6 shadow-xl border-r border-gray-800
          transition-transform duration-300 ease-in-out
          ${props.isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
      `}>
        
        <div className="flex items-center justify-between mb-2 px-2">
          <h1 className="text-2xl font-bold">TODO-List</h1>
          <MdClose 
            className="text-2xl text-gray-400 cursor-pointer md:hidden" 
            onClick={() => props.setOpen(false)} 
          />
        </div>

        <nav className="flex flex-col gap-1 border-b border-gray-700 pb-4">
          <h2 className="text-xs font-bold text-gray-500 uppercase mb-2 pl-2">Menu</h2>
          
          {/* Manual Menu Items */}
          <div onClick={() => handleMenuClick("Home")} className={`px-3 py-2 rounded-[8px] cursor-pointer flex items-center gap-3 text-sm font-medium ${activeView == "Home" ? "bg-orange-400 text-white" : "text-gray-400"}`}>
              <span className="w-2 h-2 rounded-full bg-gray-600"></span> Home
          </div>
          <div onClick={() => handleMenuClick("Back-Log")} className={`px-3 py-2 rounded-[8px] cursor-pointer flex items-center gap-3 text-sm font-medium ${activeView == "Back-Log" ? "bg-orange-400 text-white" : "text-gray-400"}`}>
              <span className="w-2 h-2 rounded-full bg-gray-600"></span> Back-Log
          </div>
          <div onClick={() => handleMenuClick("Done")} className={`px-3 py-2 rounded-[8px] cursor-pointer flex items-center gap-3 text-sm font-medium ${activeView == "Done" ? "bg-orange-400 text-white" : "text-gray-400"}`}>
              <span className="w-2 h-2 rounded-full bg-gray-600"></span> Done
          </div>
          <div onClick={() => handleMenuClick("Confirm")} className={`px-3 py-2 rounded-[8px] cursor-pointer flex items-center gap-3 text-sm font-medium ${activeView == "Confirm" ? "bg-orange-400 text-white" : "text-gray-400"}`}>
              <span className="w-2 h-2 rounded-full bg-gray-600"></span> Confirm
          </div>

        </nav>

        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          <div className="flex justify-between items-end pl-2 pr-1">
            <h2 className="text-xs font-bold text-gray-500 uppercase">Workspaces</h2>
            <span className="text-[10px] text-gray-600">{groups.length} Active</span>
          </div>

          <div className="flex flex-col gap-1 overflow-y-auto pr-1">
            {groups.map((g) => {
              var isActive = false;
              if (activeGroup == g) isActive = true;
              
              var isEditing = false;
              if (editTarget == g) isEditing = true;

              return (
                <div
                  key={g}
                  onClick={() => handleGroupClick(g)}
                  className={`group relative px-3 py-2 rounded-[8px] cursor-pointer flex items-center justify-between text-sm font-medium border border-transparent ${
                    isActive 
                      ? "bg-gray-800 text-orange-400 border-gray-700" 
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden flex-1">
                    {isActive ? <MdFolderOpen className="text-xl"/> : <MdFolder className="text-xl"/>}
                    
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="bg-transparent text-white w-full outline-none h-6 text-base border-b border-orange-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    ) : (
                      <span className="truncate text-base">{g}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-2"> 
                    {isEditing ? (
                      <>
                        <MdCheckCircle className="text-green-500 text-2xl" onClick={finishEdit}/>
                        <MdCancel className="text-red-500 text-2xl" onClick={(e) => { e.stopPropagation(); setEditTarget(null); }}/>
                      </>
                    ) : (
                      <div className={`flex gap-2 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                        <MdEdit 
                          className="text-gray-400 hover:text-white"
                          onClick={(e) => beginEdit(e, g)}
                        />
                        <MdDelete 
                          className="text-gray-400 hover:text-red-500"
                          onClick={(e) => clickDelete(e, g)}
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-gray-700">
            <div className="flex items-center bg-gray-800 rounded-[8px] px-3 py-2 border border-gray-700">
              <input 
                type="text" 
                placeholder="New..." 
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => { if(e.key == 'Enter') submitNew(); }}
                className="bg-transparent border-none text-sm text-white w-full outline-none"
              />
              <IoIosAddCircle 
                className="cursor-pointer text-3xl text-orange-500"
                onClick={submitNew}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default SideBar;