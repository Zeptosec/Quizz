import { useState } from "react"
import { useQuestionContext } from "../hooks/useQuestionsContext";


const QuestionForm = () => {
    const { dispatch } = useQuestionContext();
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [inputList, setInputList] = useState([{ answer: "" }]);
    const [message, setMessage] = useState("");

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

    const handleAddClick = () => {
        setInputList([...inputList, { answer: "" }]);
    }

    const handleSubmit = async function (e) {
        e.preventDefault();
        setIsLoading(true);
        let answers = [];
        inputList.map(x => answers.push(x.answer));

        const res = await fetch("http://localhost:4000/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question,
                answers,
                points: 1,
                difficulty: 1
            })
        });

        const json = await res.json();
        if (!json.error) {
            setInputList([{ answer: "" }]);
            setQuestion("");
            setMessage("Added successfully");
            setTimeout(() => {
                setMessage("");
                setIsLoading(false);
            }, 3000);
            dispatch({ type: 'CREATE_QUESTION', payload: json.task })
        } else {
            setMessage(json.error);
            setIsLoading(false);

        }
    }

    return (
        <form onSubmit={handleSubmit} className="create">
            <h3>Add New Question</h3>
            <label htmlFor="">Question</label>
            <input
                type="text"
                onChange={e => setQuestion(e.target.value)}
                value={question} />
            <label htmlFor="">Answers:</label>
            {inputList.map((x, i) => (
                <div key={i}>
                    <input
                        className="fld"
                        type="text"
                        onChange={e => handleInputChange(e, i)}
                        value={x.answer} />
                </div>
            ))}
            <div>
                <button type="button" onClick={handleAddClick}>More</button>
                <button type="button" onClick={handleRemoveClick}>Less</button>
                <button disabled={isLoading}>Submit</button>
            </div>
            {message}
        </form>
    )
}

export default QuestionForm;