import { useEffect } from 'react';
import QuestionDetails from '../components/QuestionDetails';
import QuestionForm from '../components/QuestionForm'
import { useQuestionContext } from '../hooks/useQuestionsContext';
import { useAuthContext } from '../hooks/useAuthContext';

const Admin = () => {
    const { questions, dispatch } = useQuestionContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchQuestions = async () => {
            const res = await fetch('http://localhost:4000/api/admin', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await res.json();
            if (res.ok) {
                dispatch({ type: 'SET_QUESTIONS', payload: json.tasks });
            }
        }
        if (user) {
            fetchQuestions();
        }
    }, [dispatch, user]);

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