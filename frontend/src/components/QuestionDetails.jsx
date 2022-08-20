import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useQuestionContext } from '../hooks/useQuestionsContext';

const QuestionDetails = ({ question }) => {
    const { dispatch } = useQuestionContext();

    const handleDelete = async () => {

        const res = await fetch('http://localhost:4000/api/tasks/'+question._id, {
            method: "DELETE"
        });
        const json = await res.json();

        if(res.ok){
            dispatch({type: 'DELETE_QUESTION', payload: json})
        }
    }

    return (
        <div className="question-details">
            <h4>{question.question}</h4>
            {question.type === "choice" ? <p>Choices: <b>{question.choices.join(", ")}</b></p> : ""}
            <p>Answers: <b>{question.answers.join(', ')}</b></p>
            <p>Type: {question.type}</p>
            <p>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true })}</p>
            <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
        </div>
    )
}

export default QuestionDetails;