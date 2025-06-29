import { useState, useEffect } from 'react'
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";

function App() {
  const [todo, setTodo] = useState("")
  const [todos, setTodos] = useState(() => {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  });
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [showfinished, setShowfinished] = useState(false)


  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  const handleAdd = () => {
    if (todo?.trim()) {
      const newTodo = {
        text: todo,
        done: false,
        createdAt: new Date().toISOString()
      };
      setTodos([...todos, newTodo])
      setTodo("")
    }
  }

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditText(todos[index].text);
  };

  const handleSaveEdit = () => {
    const newTodos = [...todos];
    newTodos[editIndex].text = editText;
    newTodos[editIndex].updatedAt = new Date().toISOString();
    setTodos(newTodos);
    setEditIndex(null);
    setEditText("");
  };


  const handleDelete = (index) => {
    const newTodos = todos.filter((_, i) => i !== index);
    setTodos(newTodos);
  };


  const handleCheckbox = (index) => {
    const newTodos = [...todos]
    newTodos[index].done = !newTodos[index].done
    if (newTodos[index].done) {
      newTodos[index].completedAt = new Date().toISOString();
    } else {
      delete newTodos[index].completedAt;
    }
    setTodos(newTodos)
  }
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleFinished = () => {
    setShowfinished(!showfinished)
  }

  return (
    <div>
      <div className="container bg-gradient-to-br from-blue-50 to-indigo-100 p-5 w-[95vw] sm:w-[80vw] md:w-[60vw] lg:w-[45vw] xl:w-[35vw] h-[80vh] mt-[10vh] mx-auto rounded-xl shadow-xl border border-indigo-200 flex flex-col">
        <h1 className='text-center text-2xl font-bold text-indigo-800'>TickTickGo-Check It. Done It. Go.</h1>
        <h2 className='text-2xl font-semibold mt-3 text-indigo-700'>Add a Todo</h2>
        <div className="flex gap-2 justify-center mt-5">
          <input
            type="text"
            placeholder='Enter New Task'
            className='w-[85%] border-2 border-indigo-300 bg-white py-2 px-5 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm'
            onChange={(e) => setTodo(e.target.value)}
            value={todo}
          />
          <button className='border-2 border-indigo-600 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-full font-medium shadow-sm transition-colors hover:cursor-pointer' onClick={handleAdd}>Save</button>
        </div>

        <div className='flex mt-5 gap-2'>
          <input type="checkbox" id='finished' onChange={toggleFinished} checked={showfinished} className='hover:cursor-pointer accent-indigo-600' />
          <div className='hover:cursor-default text-indigo-700'>Show Finished Todos</div>
        </div>

        <div className='h-[1px] w-[90%] bg-indigo-300 mt-2.5 mb-2.5 mx-auto opacity-50'></div>

        <h2 className='text-2xl font-semibold text-indigo-700 mb-8'>Your Todos</h2>
        <div className="todos max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {
            todos
              .filter((item) => showfinished || !item.done)
              .map((item, index) => {
                const timestampCount =
                  (item.createdAt ? 1 : 0) +
                  (item.updatedAt ? 1 : 0) +
                  (item.completedAt ? 1 : 0);

                const paddingMap = {
                  1: 'pb-8',
                  2: 'pb-12',
                  3: 'pb-14'
                };

                const dynamicPadding = paddingMap[timestampCount] || 'pb-0';
                return (
                  <div className={`relative w-full mb-3 bg-white bg-opacity-60 p-3 ${dynamicPadding} rounded-lg border border-indigo-200 shadow-sm`} key={index}>
                    <div className='flex justify-between items-center mb-2'>
                      <div className='todo flex gap-1 items-baseline relative w-[75%]'>
                        <input type="checkbox" onChange={() => handleCheckbox(index)} checked={item.done} id={`todo-${index}`} className='hover:cursor-pointer accent-indigo-600' />
                        {editIndex === index ? (
                          <input
                            type="text"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="border-2 border-indigo-400 rounded-lg px-3 py-2 w-[80%] focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-indigo-50 shadow-sm"
                          />
                        ) : (
                          <div className={`text-lg ${item.done ? "line-through text-gray-400" : "text-gray-700"} hover:cursor-default max-w-[85%] sm:max-w-[95%] wrap-break-word`}>{item.text}</div>
                        )}

                      </div>
                      <div className='flex h-full'>
                        {editIndex === index ? (
                          <button
                            onClick={handleSaveEdit}
                            className='bg-emerald-600 hover:bg-emerald-700 p-2 py-1 text-sm font-bold text-white rounded-md mx-1 transition-colors shadow-sm hover:cursor-pointer'
                          >
                            Save
                          </button>
                        ) : (
                          <button
                            onClick={() => handleEdit(index)}
                            className='bg-indigo-600 hover:bg-indigo-700 p-2 py-1 text-sm font-bold text-white rounded-md mx-1 hover:cursor-pointer transition-colors shadow-sm'
                          >
                            <FaEdit />
                          </button>
                        )}

                        <button onClick={() => handleDelete(index)} className='bg-red-500 hover:bg-red-600 p-2 py-1 text-sm font-bold text-white rounded-md mx-1 hover:cursor-pointer transition-colors shadow-sm'><AiFillDelete /></button>
                      </div>
                    </div>

                    <div className='absolute bottom-2 left-3 text-xs text-gray-500'>
                      {item.createdAt && (
                        <div>Created: {formatDate(item.createdAt)}</div>
                      )}
                      {item.updatedAt && (
                        <div>Updated: {formatDate(item.updatedAt)}</div>
                      )}
                      {item.completedAt && (
                        <div className='text-green-600'>Completed: {formatDate(item.completedAt)}</div>
                      )}
                    </div>
                  </div>
                )
              })
          }
        </div>
      </div>
    </div>
  )
}

export default App;