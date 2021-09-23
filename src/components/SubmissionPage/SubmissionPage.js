import React, { useContext } from 'react';
import AuthContext from '../../Context';

const SubmissionPage = (props) => {
    const Main = useContext(AuthContext); //Might come in handy...
    const ExamId = props.match.params.id;
    return (
        <div>
            <h1>YET TO BE MADE</h1>
        </div>
    )
}

export default SubmissionPage;
