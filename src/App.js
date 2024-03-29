import { useState, useEffect } from 'react'
import Todo from './components/Todo';

const SEED = [
  { id: "todo-0", name: "Work out", completed: true },
  { id: "todo-1", name: "Dance", completed: false },
  { id: "todo-2", name: "Eat", completed: false },
]

function saveData(tasks) {
  localStorage.setItem('tasksData', JSON.stringify(tasks));
}

if (!localStorage.getItem("tasksData")) {
  saveData(SEED);
}

const FILTER_MAP = {
  전체: () => true,
  완료: (task) => task.completed,
  미완료: (task) => !task.completed
}

const FILTER_NAMES = Object.keys(FILTER_MAP);

export default function App() {
  const initialTasks = JSON.parse(localStorage.getItem("tasksData"));
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("전체");

  // key state tracking
  console.log(tasks);

  // synchronize localStorage
  useEffect(() => {
    saveData(tasks);
  }, [tasks]);

  // title update
  useEffect(() => {
    document.title = "Todo App";
  }, [])

  function addTask() {
    const newTask = {
      id: `todo-${Date.now()}`,
      name: "",
      completed: false
    };

    const updatedTasks = [newTask, ...tasks];

    setTasks(updatedTasks);
  }

  function deleteTask(id) {
    const remainingTasks = tasks.filter(task => task.id !== id);

    setTasks(remainingTasks);
  }

  function toggleTaskCompleted(id) {
    const updatedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, completed: !task.completed }
      }
      return task;
    })

    setTasks(updatedTasks);
  }

  function editTask(id, newName) {
    const editedTasks = tasks.map(task => {
      if (task.id === id) {
        return { ...task, name: newName }
      }
      return task;
    })

    setTasks(editedTasks);
  }

  const filterButtons = FILTER_NAMES.map(name => (
    <button
      key={name}
      className="disabled:font-bold"
      disabled={name === filter}
      onClick={() => setFilter(name)}
    >
      {name}
    </button>
  ))

  const taskList = tasks.filter(FILTER_MAP[filter]).map(task => (
    <Todo
      key={task.id}
      id={task.id}
      name={task.name}
      completed={task.completed}
      deleteTask={deleteTask}
      toggleTaskCompleted={toggleTaskCompleted}
      editTask={editTask}
    />
  ))

  return (
    <div className="max-w-sm mx-auto px-4">
      <h1 className="text-2xl font-semibold text-center my-8">
        Todo App
      </h1>

      <div className="flex justify-between mb-4">
        <div className="flex gap-2 py-1">
          {filterButtons}
        </div>
        <button
          type="submit"
          className="px-2 py-1 rounded bg-blue-500 hover:bg-blue-600 text-white font-semibold"
          onClick={addTask}
        >
          새 할일 +
        </button>
      </div>

      <h2 className="mb-4 text-gray-500">
        총 {taskList.length}개 있습니다
      </h2>
      <ul>
        {taskList}
      </ul>
    </div>
  )
}



