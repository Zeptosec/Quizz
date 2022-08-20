import { useState } from "react"
import { useQuestionContext } from "../hooks/useQuestionsContext";


const ChoicesQuestionForm = () => {
    const { dispatch } = useQuestionContext();
    const [question, setQuestion] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [inputList, setInputList] = useState([{ answer: "" }, { answer: "" }]);
    const [answersList, setAnswersList] = useState([]);
    const [message, setMessage] = useState("");

    const handleInputChange = (e, index) => {
        const list = [...inputList];
        list[index].answer = e.target.value;
        setInputList(list);
    }

    const handleRemoveClick = () => {
        if (inputList.length === 2) return;
        const list = [...inputList];
        list.splice(inputList.length - 1, 1);
        setInputList(list);
    }

    const handleAddClick = () => {
        setInputList([...inputList, { answer: "" }]);
    }

    const handleSubmit = async function (e) {
        e.preventDefault();
        if (answersList.length === 0) {
            setMessage("Select at least one choice as an answer");
            return;
        }
        for (let i = 0; i < inputList.length; i++) {
            if (inputList[i].answer.replace(/\s+/g, '').length === 0) {
                setMessage("All fields must have a valid value");
                return;
            }
        }
        setIsLoading(true);
        let choices = [];
        inputList.map(x => choices.push(x.answer));
        let answers = [];
        answersList.map(x => answers.push(x));

        const res = await fetch("http://localhost:4000/api/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                question,
                answers,
                choices,
                points: 1,
                difficulty: 1,
                type: "choice"
            })
        });

        const json = await res.json();
        if (!json.error) {
            setInputList([{ answer: "" }, { answer: "" }]);
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

    const handleCheckbox = (e, i) => {
        let list = [...answersList];
        if (e.target.checked) {
            list.push(i);
        } else {
            list = list.filter(w => w !== i);
        }
        setAnswersList(list);
    }

    return (
        <form onSubmit={handleSubmit} className="create">
            <label htmlFor=""><b>Question</b></label>
            <input
                type="text"
                onChange={e => setQuestion(e.target.value)}
                value={question} />
            <label htmlFor=""><b>Choices:</b></label>
            {inputList.map((x, i) => (
                <div key={i} className="admin-choices">
                    <input
                        className="fld"
                        type="checkbox"
                        onChange={e => handleCheckbox(e, i)} />
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
            </div>
            <p><b>Answers:</b></p>
            {answersList && answersList.map((x, i) => (
                <div key={i}>
                    <p>{inputList[x].answer}</p>
                </div>
            ))}
            <button disabled={isLoading}>Submit</button>
            {message}
        </form>
    )
}

export default ChoicesQuestionForm;