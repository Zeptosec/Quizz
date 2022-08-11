import { useEffect } from "react";
import { useState } from "react";
const ViewTasks = () => {
  const [tasks, setTasks] = useState([]);
  const getTasks = async () => {
    const res = await fetch("http://localhost:4000/api/tasks");
    const json = await res.json();
    setTasks(json);
  };
  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div className="viewTasks">
      {tasks.map((x) => (
        <div>x.question</div>
      ))}
    </div>
  );
};

export default ViewTasks;
