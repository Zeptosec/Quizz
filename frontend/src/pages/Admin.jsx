import { useEffect } from 'react';
import QuestionDetails from '../components/QuestionDetails';
import QuestionForm from '../components/QuestionForm'
import { useQuestionContext } from '../hooks/useQuestionsContext';

const Admin = () => {
    const { questions, dispatch } = useQuestionContext();

    useEffect(() => {
        const fetchQuestions = async () => {
            const res = await fetch('http://localhost:4000/api/tasks');
            const json = await res.json();
            if (res.ok) {
                dispatch({ type: 'SET_QUESTIONS', payload: json.tasks });
            }
        }
        fetchQuestions();
    }, [dispatch]);

    return (
        <div className="admin">
            <div className="questions">
                {questions && questions.map(q => 
                    <QuestionDetails key={q._id} question={q} />
                )}
            </div>
            <QuestionForm />
        </div>
    )
}

export default Admin;