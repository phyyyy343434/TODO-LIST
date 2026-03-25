import { useState, useEffect } from "react";
import { MdDeleteSweep, MdEdit, MdCheckCircle, MdCancel, MdMenu } from "react-icons/md";
import { IoIosAddCircle } from "react-icons/io";

function Place(props) {
  // props destructuring manual
  var activeView = props.view;
  var columnTasks = props.tasks;
  var setColumnTasks = props.setTasks;
  var currentGroupId = props.groupId;

  var cols = ["Task", "Back-Log", "Doing", "Done", "Confirm"];
  
  const [search, setSearch] = useState("");
  
  // separate states is easier for me
  const [txtTask, setTxtTask] = useState("");
  const [txtBack, setTxtBack] = useState("");
  const [txtDoing, setTxtDoing] = useState("");
  const [txtDone, setTxtDone] = useState("");
  const [txtConfirm, setTxtConfirm] = useState("");

  const [editLoc, setEditLoc] = useState(null);
  const [editVal, setEditVal] = useState("");

  // simple selection state
  const [sel, setSel] = useState({});

  useEffect(() => {
    // reset everything when group changes
    setTxtTask("");
    setTxtBack("");
    setTxtDoing("");
    setTxtDone("");
    setTxtConfirm("");
    setSel({});
    setEditLoc(null);
    setSearch(""); 
  }, [currentGroupId]);

  // helper to get input
  function getInputValue(c) {
      if (c == "Task") return txtTask;
      if (c == "Back-Log") return txtBack;
      if (c == "Doing") return txtDoing;
      if (c == "Done") return txtDone;
      if (c == "Confirm") return txtConfirm;
      return "";
  }

  // helper to set input
  function setInputValue(c, val) {
      if (c == "Task") setTxtTask(val);
      if (c == "Back-Log") setTxtBack(val);
      if (c == "Doing") setTxtDoing(val);
      if (c == "Done") setTxtDone(val);
      if (c == "Confirm") setTxtConfirm(val);
  }

  function handleAdd(c) {
      var val = getInputValue(c);
      if (val != "") {
          setColumnTasks(function(prev) {
             var copy = { ...prev };
             if (copy[c] == undefined) copy[c] = [];
             
             var arr = [...copy[c]];
             arr.push(val);
             copy[c] = arr;
             return copy;
          });
          setInputValue(c, "");
      }
  }

  function enterCheck(c, e) {
      if (e.key == "Enter") {
          e.preventDefault();
          handleAdd(c);
      }
  }

  function startEdit(c, idx, text) {
      setEditLoc({ col: c, i: idx });
      setEditVal(text);
  }

  function saveEdit() {
      if (editLoc != null) {
          var c = editLoc.col;
          var i = editLoc.i;
          
          setColumnTasks(function(old) {
              var temp = { ...old };
              var list = [...temp[c]];
              list[i] = editVal;
              temp[c] = list;
              return temp;
          });
          setEditLoc(null);
      }
  }

  function moveNext(c, idx) {
      // find next column
      var index = -1;
      for(var i=0; i<cols.length; i++) {
          if (cols[i] == c) {
              index = i;
          }
      }

      if (index != -1 && index < cols.length - 1) {
          var nextC = cols[index + 1];

          setColumnTasks(function(prev) {
              var obj = { ...prev };
              var list1 = [...obj[c]];
              var list2 = [...obj[nextC]];

              var item = list1[idx];
              // remove from first
              list1.splice(idx, 1);
              // add to second
              list2.push(item);

              obj[c] = list1;
              obj[nextC] = list2;
              return obj;
          });
      }
  }

  function doSelect(c, idx) {
     var temp = { ...sel };
     if (temp[c] == undefined) temp[c] = {};
     
     if (temp[c][idx] == true) {
         temp[c][idx] = false;
     } else {
         temp[c][idx] = true;
     }
     setSel(temp);
  }

  function deleteSelected(c) {
      setColumnTasks(function(prev) {
          var obj = { ...prev };
          var list = obj[c];
          var newList = [];

          var selectedMap = sel[c] || {};

          for(var i=0; i<list.length; i++) {
              if (selectedMap[i] != true) {
                  newList.push(list[i]);
              }
          }
          
          obj[c] = newList;
          return obj;
      });
      
      // clear selection
      var t = { ...sel };
      t[c] = {};
      setSel(t);
  }

  // logic for view
  var showCols = cols;
  if (activeView != "Home") {
      showCols = [activeView];
  }

  return (
    <div className="flex-1 p-4 md:p-8 min-h-screen flex flex-col w-full overflow-x-auto bg-transparent">
      
      {/* Mobile button */}
      <div className="flex items-center gap-4 mb-6 md:hidden bg-gray-900/80 p-2 rounded-lg flex-shrink-0 sticky top-0 z-30">
        <button onClick={props.openMobileMenu} className="p-2 bg-gray-800 rounded-md text-orange-500">
            <MdMenu className="text-3xl" />
        </button>
        <h1 className="text-xl font-bold text-white">
            {activeView == "Home" ? currentGroupId : activeView}
        </h1>
      </div>

      {/* search bar */}
      {activeView != "Home" ? (
        <div className="w-full max-w-[600px] mx-auto mb-8">
           <input 
              type="text" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full p-4 rounded-[12px] bg-gray-900/90 text-white border border-gray-600"
              placeholder={"Search " + activeView}
           />
        </div>
      ) : null}

      <div className="flex gap-6 flex-col md:flex-row items-start pb-20 justify-center">
        {showCols.map((cName) => {
          var tasks = columnTasks[cName] || [];
          
          return (
            <div key={cName} className="flex flex-col w-full max-w-lg md:w-[450px]">
              
              <h1 className="bg-orange-50/95 rounded-[12px] p-3 text-center font-bold text-xl text-black z-10 sticky top-16 md:static">
                {cName}
              </h1>

              <div className="bg-orange-50/90 rounded-[12px] text-black mt-3 p-5 flex flex-col min-h-[150px]">
                
                {cName == "Task" ? (
                    <div>
                      <h1 className="p-3 text-center font-semibold text-lg">Create Task</h1>
                      <textarea
                        value={getInputValue(cName)}
                        onChange={(e) => setInputValue(cName, e.target.value)}
                        onKeyDown={(e) => enterCheck(cName, e)}
                        placeholder="Type here..."
                        className="bg-orange-200 w-full rounded-[10px] px-4 py-2"
                        rows={2}
                      />
                    </div>
                ) : (
                    <div className="text-center text-gray-500 text-sm italic mb-2">
                       Task: {tasks.length}
                    </div>
                )}

                <ul className="mt-4 space-y-3 flex-1">
                  {tasks.map((t, idx) => {
                    // search filter manual
                    if (search != "") {
                        if (!t.toLowerCase().includes(search.toLowerCase())) {
                            return null;
                        }
                    }

                    var isEditing = false;
                    if (editLoc && editLoc.col == cName && editLoc.i == idx) {
                        isEditing = true;
                    }
                    
                    var isChecked = false;
                    if (sel[cName] && sel[cName][idx]) isChecked = true;

                    return (
                      <li key={idx} className="bg-orange-200 w-full rounded-[10px] p-2 flex items-center gap-2 hover:bg-orange-300">
                        {isEditing ? (
                            <div className="flex w-full gap-2 items-center">
                                <input 
                                    value={editVal} 
                                    onChange={(e) => setEditVal(e.target.value)}
                                    className="flex-1 bg-transparent border-none"
                                />
                                <MdCheckCircle onClick={saveEdit} className="text-2xl cursor-pointer" />
                                <MdCancel onClick={() => setEditLoc(null)} className="text-2xl cursor-pointer" />
                            </div>
                        ) : (
                            <>
                                <input 
                                  type="checkbox" 
                                  checked={isChecked}
                                  onChange={() => doSelect(cName, idx)} 
                                  className="mt-1 w-4 h-4 cursor-pointer" 
                                />
                                <span 
                                  onClick={() => moveNext(cName, idx)} 
                                  className="flex-1 cursor-pointer select-none"
                                >
                                  {t}
                                </span>
                                <MdEdit 
                                  className="text-orange-800 opacity-50 hover:opacity-100 cursor-pointer" 
                                  onClick={() => startEdit(cName, idx, t)} 
                                />
                            </>
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="flex gap-x-2 justify-center mt-4 pt-2 border-t border-orange-200">
                  {cName == "Task" ? (
                    <button 
                      className="w-[38%] bg-orange-300 hover:bg-orange-400 rounded-[10px] py-1 shadow-md" 
                      onClick={() => handleAdd(cName)}
                    >
                      <IoIosAddCircle className="text-[30px] text-white mx-auto" />
                    </button>
                  ) : null}
                  
                  <button 
                    className="flex-1 bg-orange-300 hover:bg-orange-400 rounded-[10px] py-1 shadow-md" 
                    onClick={() => deleteSelected(cName)}
                  >
                    <MdDeleteSweep className="text-[30px] text-white mx-auto" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Place;