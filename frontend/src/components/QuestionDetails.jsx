import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useAuthContext } from '../hooks/useAuthContext';
import { useQuestionContext } from '../hooks/useQuestionsContext';

const QuestionDetails = ({ question }) => {
    const { dispatch } = useQuestionContext();
    const { user } = useAuthContext();

    const handleDelete = async () => {
        if(!user) {
            return;
        }
        const res = await fetch('https://latinapi.herokuapp.com/api/admin/'+question._id, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
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