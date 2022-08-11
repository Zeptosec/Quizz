import { useState } from "react";

const AddNew = () => {
    const [question, setQuestion] = useState("");
    const [points, setPoints] = useState(0);
    const [difficulty, setDifficulty] = useState(0);
    const [inputList, setInputList] = useState([{ answer: "" }]);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = (e, index) => {
        const list = [...inputList];
        list[index].answer = e.target.value;
        setInputList(list);
    }

    const handleRemoveClick = () => {
        if (inputList.length === 1) return;
        const list = [...inputList];
        list.splice(inputList.length - 1, 1);
        setInputList(list);
    }

    const handleSubmit = async function () {
        setIsLoading(true);
        let answers = [];
        inputList.map(x => answers.push(x.answer));

        const res = await fetch("http://localhost:4000/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question,
                answers,
                points,
                difficulty
            })
        });

        const json = await res.json();
        if (!json.error) {
            setInputList([{ answer: "" }]);
            setDifficulty(0);
            setPoints(0);
            setQuestion("");
            setMessage("Added successfully");
            setTimeout(() => setMessage(""), 3000);
        } else {
            setMessage(json.error);
        }
        setIsLoading(false);
    }

    const handleAddClick = () => {
        setInputList([...inputList, { answer: "" }]);
    }

    return (
        <div className="admin">
            <h2>Add new question</h2>
            <div className="frm">
                <label className="lbl">Question: </label>
                <input
                    className="fld"
                    type="text"
                    onChange={e => setQuestion(e.target.value)}
                    value={question} />
                <label className="lbl">Points: </label>
                <input
                    className="fld"
                    type="number"
                    onChange={e => setPoints(e.target.value)}
                    value={points} />
                <label className="lbl">Difficulty: </label>
                <input
                    className="fld"
                    type="text"
                    onChange={e => setDifficulty(e.target.value)}
                    value={difficulty} />
                {inputList.map((x, i) => (
                    <div key={i}>
                        <label className="lbl">Answer: </label>
                        <input
                            className="fld"
                            type="text"
                            onChange={e => handleInputChange(e, i)}
                            value={x.answer} />
                    </div>
                ))}

                <div>
                    <button onClick={handleAddClick}>More</button>
                    <button onClick={handleRemoveClick}>Less</button>
                    <button disabled={isLoading} onClick={handleSubmit}>Submit</button>
                </div>
                {message}
            </div>
        </div>
    )
}

export default AddNew;