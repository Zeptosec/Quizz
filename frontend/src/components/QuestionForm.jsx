import { useState } from "react"
import ChoicesQuestionForm from "./ChoicesQuestionForm";
import OpenQuestionForm from "./OpenQuestionForm";


const QuestionForm = () => {
    const [type, setType] = useState("free");

    const handleType = (e) => {
        setType(e.target.value);
    }

    return (
        <div>
            <h3 className="center">Add New Question</h3>
            <label htmlFor="type">Type</label>
            <select name="type" id="type" defaultValue="free" onChange={handleType}>
                <option value="free">Free</option>
                <option value="choice">Multiple Choice</option>
            </select>
            {type === "free" ? <OpenQuestionForm /> : <ChoicesQuestionForm />}
        </div>
    )
}

export default QuestionForm;