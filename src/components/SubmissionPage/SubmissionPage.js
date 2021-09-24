import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../Context";
import axios from "axios";
import './Submission.css';

const SubmissionPage = (props) => {
  const Main = useContext(AuthContext); //Might come in handy...
  const [data, setData] = useState({});
  const ExamId = props.match.params.id;
  const [fetchedData, updateStatus] = useState(false);

  useEffect(() => {
    if (Main.AccessToken !== null && !Main.isError.is && !fetchedData) {
      Main.toggleLoader(true);
      axios
        .get(Main.url + `/submissions/assessment/${ExamId}`, {
          headers: { Authorization: Main.AccessToken },
        })
        .then((response) => {
          console.log(response);
          setData(response.data);
          updateStatus(true);
          Main.toggleLoader(false);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
        });
    }
  }, [Main]);

   if(!fetchedData) return <p>Loading ... </p>
  return (
    <div style={{
      backgroundColor:"white"
    }}>
      <div className="title-bg">
        <h1 className="title">Submissions for Assessment</h1>
      </div>
      {data?data.map((submission)=>{
        return (
        <div className="student-card">
          <h1 className="student-name">{submission.student.name}</h1>
          <p className="student-detail">Roll No.: {submission.student.profile.rollNo}</p>
          <p className="student-detail">Email: <a href={`mailto:${submission.student.email}`}>{submission.student.email}</a></p>
          <p className="student-detail">Submission Time: {new Date(submission.createdAt).toLocaleString()}</p>

          <button className="button" onClick={()=>{
            Main.toggleLoader(true);
            axios
            .get(Main.url + `/submissions/${submission.id}/pdf`, {
              headers: { Authorization: Main.AccessToken },
            }).then((response) => {
              const blob = new Blob([response.data], {type: 'application/pdf'})
              const link = document.createElement('a')
              link.href = window.URL.createObjectURL(blob)
              link.download = `${submission.student.profile.rollNo}.pdf`
              link.click()
              this.closeModal() // close modal
              Main.toggleLoader(false);
            })
          .catch(err => Main.RefreshAccessToken())
          }}>Download Answer Sheet</button>
        </div>)
      }):null}
    </div>
  );
};

export default SubmissionPage;
