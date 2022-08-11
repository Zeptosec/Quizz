import { useEffect } from "react";
import { useState } from "react";
const ViewTasks = () => {
    const [tasks, setTasks] = useState([]);
    const getTasks = async () => {
        const res = await fetch("http://localhost:4000/api/tasks");
        const json = await res.json();
        setTasks(Array.from(json.tasks));
    };
    useEffect(() => {
        getTasks();
    }, []);

    const handleClick = async (id) => {
        const res = await fetch("http://localhost:4000/api/tasks/" + id, {
            method: "DELETE"
        });
        if (res.ok) {
            const json = await res.json();
            console.log(tasks);
            const tmpTasks = tasks.filter(x => x._id != json._id);
            console.log(tmpTasks);
            setTasks(tmpTasks);
        }
    }

    return (
        <div className="viewTasks">
            {tasks.length > 0 ? tasks.map(x => (
                <div className="task" key={x._id}>
                    <h3>{x.question}</h3>
                    <p>Difficulty: {x.difficulty}, Points: {x.points}</p>
                    <p>Answers: {x.answers.join(", ")}</p>
                    <span onClick={() => handleClick(x._id)}>X</span>
                </div>
            )) : <h1>There are no tasks</h1>}
        </div>
    );
};

export default ViewTasks;
