import { useEffect } from 'react';
import QuestionDetails from '../components/QuestionDetails';
import QuestionForm from '../components/QuestionForm'
import { useQuestionContext } from '../hooks/useQuestionsContext';
import { useAuthContext } from '../hooks/useAuthContext';
import { useState } from 'react';
import { useRef } from 'react';

const Admin = () => {
    const targetRef = useRef();
    const { questions, dispatch } = useQuestionContext();
    const { user } = useAuthContext();
    const [error, setError] = useState(null);
    window.addEventListener('resize', handleResize);

    function handleResize() {
        if(!targetRef.current) return;
        targetRef.current.style.maxHeight=`${window.innerHeight-126}px`
    }

    useEffect(() => {
        handleResize();
        const fetchQuestions = async () => {
            const res = await fetch('https://latinapi.cyclic.app/api/admin', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            const json = await res.json();
            if (res.ok) {
                dispatch({ type: 'SET_QUESTIONS', payload: json.tasks });
            } else {
                setError("You're not supposed to be here.");
            }
        }
        if (user) {
            fetchQuestions();
        }
    }, [dispatch, user]);

    return (
        <div className="admin">
            <div ref={targetRef} className="questions">
                {error && <div className='error'>{error}</div>}
                {questions && questions.map(q =>
                    <QuestionDetails key={q._id} question={q} />
                )}
            </div>
            <QuestionForm />
        </div>
    )
}

export default Admin;