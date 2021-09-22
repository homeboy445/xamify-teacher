import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../../Context";
import "./ExamCreator.css";

const sampleData = [
  {
    question: "What is a thread?",
    type: "Type",
  },
  {
    question: "What are some task scheduling algorithms used by OS?",
    type: "MCQ",
    choices: ["Round-Robin Scheduling", "FCFS algo", "all of the above"],
  },
  {
    question: "What do you mean by IPC?",
    type: "Type",
  },
];

const ExamCreator = (props) => {
  const Main = useContext(AuthContext);
  const [ExamDetails, update_Details] = useState([]);
  const [questions, set_questions] = useState([]);
  const [instructions, set_instructions] = useState("");

  const [DeleteQBox, ToggleDelQBx] = useState({
    is: false,
    index: -1,
  });

  //State variables for maintaining the box's states...
  const [AddProblemBoxOpen, ToggleAddPrBox] = useState({
    is: false,
    editor: -1,
  });
  const [TypeOfAnswering, set_TypeOfAns] = useState(0);
  const [ProblemStatement, set_PrStat] = useState("");
  const [MaxChoice, set_MxChoice] = useState(2);
  const [choice1, change_choice1] = useState("");
  const [choice2, change_choice2] = useState("");
  const [choice3, change_choice3] = useState("");
  const [choice4, change_choice4] = useState("");
  const ExamId = props.match.params.id;

  const getMode = () => {
    let a = ExamDetails;
    return TypeOfAnswering === 0
      ? "MCQ"
      : a.length === 0 || a.type === "DIGITAL"
      ? "TYPE"
      : "IMAGE";
  };

  useEffect(() => {
    if (Main.AccessToken !== null && questions.length === 0) {
      axios
        .get(Main.url + `/assessments/${ExamId}`, {
          headers: {
            Authorization: Main.AccessToken,
          },
        })
        .then((response) => {
          if (response.data.questions.length > 0) {
            Main.toggleErrorBox({
              is: true,
              info: "Editing is not supported yet. Redirecting to dashboard...",
            });
            setTimeout(() => (window.location.href = "/dashboard"), 10000);
            return;
          }
          update_Details(response.data);
        })
        .catch((e) => {
          Main.RefreshAccessToken();
        });
    }
    let idx = AddProblemBoxOpen.editor;
    if (idx !== -1) {
      set_TypeOfAns(questions[idx].type === "MCQ" ? 0 : 1);
      set_PrStat(questions[idx].question);
      if (questions[idx].type === "MCQ") {
        set_MxChoice(questions[idx].choices.length);
      }
    }
  }, [questions, AddProblemBoxOpen, Main]);

  return (
    <div className="examCreator">
      <div
        className="remove_Q"
        style={{
          opacity: DeleteQBox.is ? 1 : 0,
          pointerEvents: DeleteQBox.is ? "all" : "none",
        }}
      >
        <h1>Are you sure about deleting this question?</h1>
        <div className="inf_btns">
          <button
            className="add_usr_btn"
            onClick={() => ToggleDelQBx({ is: false, index: -1 })}
          >
            Don't Delete
          </button>
          <button
            onClick={() => {
              let q1 = questions,
                index = DeleteQBox.index;
              if (index === -1) {
                return ToggleDelQBx({ is: false, index: -1 });
              }
              q1.splice(index, 1);
              set_questions(q1);
              return ToggleDelQBx({ is: false, index: -1 });
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <div
        className="q_add_box"
        style={{
          opacity: AddProblemBoxOpen.is ? 1 : 0,
          pointerEvents: AddProblemBoxOpen.is ? "all" : "none",
        }}
      >
        <h2>Add Problem</h2>
        <div className="q_add_bx_1">
          <h2>Problem's answering mode</h2>
          <div className="q_bx_1">
            <div>
              <input
                type="radio"
                checked={TypeOfAnswering === 0}
                onChange={(e) => {
                  set_TypeOfAns(0);
                }}
              />
              <h3>MCQ</h3>
            </div>
            <div>
              <input
                type="radio"
                checked={TypeOfAnswering === 1}
                onChange={(e) => {
                  set_TypeOfAns(1);
                }}
              />
              <h3>
                {ExamDetails.length === 0
                  ? "Typed"
                  : ExamDetails.type === "DIGITAL"
                  ? "Typed"
                  : "Image Upload"}
              </h3>
            </div>
          </div>
        </div>
        <div className="q_add_bx_2">
          <h2>Type the problem statement below</h2>
          <textarea
            value={ProblemStatement}
            onChange={(e) => {
              set_PrStat(e.target.value);
            }}
          ></textarea>
        </div>
        {TypeOfAnswering === 0 ? (
          <div className="add_mcq_ch">
            <div className="mcq_1">
              <h2>Add choices for MCQ</h2>
              <select
                value={MaxChoice}
                onChange={(e) => {
                  set_MxChoice(e.target.value);
                }}
              >
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
            </div>
            <div className="mcq_choices">
              <input
                type="text"
                placeholder="Choice 1"
                required
                value={choice1}
                onChange={(e) => {
                  change_choice1(e.target.value);
                }}
              />
              <input
                type="text"
                placeholder="Choice 2"
                required
                value={choice2}
                onChange={(e) => {
                  change_choice2(e.target.value);
                }}
              />
              <input
                type="text"
                placeholder="Choice 3"
                required
                disabled={MaxChoice < 3}
                value={choice3}
                style={{
                  opacity: MaxChoice < 3 ? 0 : 1,
                }}
                onChange={(e) => {
                  change_choice3(e.target.value);
                }}
              />
              <input
                type="text"
                required
                placeholder="Choice 4"
                disabled={MaxChoice < 4}
                value={choice4}
                style={{
                  opacity: MaxChoice < 4 ? 0 : 1,
                }}
                onChange={(e) => {
                  change_choice4(e.target.value);
                }}
              />
            </div>
          </div>
        ) : null}
        <div className="inf_btns">
          <button
            className="add_usr_btn"
            onClick={(e) => {
              if (ProblemStatement.trim() === "") {
                return;
              }
              e.preventDefault();
              let n = AddProblemBoxOpen.editor;
              let k = -1;
              if (n === -1) {
                k = 1;
                n = questions.length;
              }
              n += 1;
              let qObj = questions;
              if (k === 1) {
                qObj.push({
                  text: ProblemStatement,
                  type: getMode(),
                });
              } else {
                qObj[n - 1].text = ProblemStatement;
                qObj[n - 1].type = getMode();
              }
              if (TypeOfAnswering === 0) {
                if (choice1.trim() === "" && choice2.trim() === "") {
                  return;
                }
                qObj[n - 1].choices = [{ text: choice1 }];
                qObj[n - 1].choices.push({ text: choice2 });
                if (MaxChoice >= 3 && choice3.trim() !== "") {
                  qObj[n - 1].choices.push({ text: choice3 });
                }
                if (MaxChoice === 4 && choice4.trim() !== "") {
                  qObj[n - 1].choices.push({ text: choice4 });
                }
              }
              set_questions(qObj);
              ToggleAddPrBox({ is: false, editor: -1 });
            }}
          >
            Done
          </button>
          <button
            onClick={() => {
              ToggleAddPrBox({ is: false, editor: -1 });
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      <h1
        className="exm_title"
        style={{
          opacity: !AddProblemBoxOpen.is && !DeleteQBox.is ? 1 : 0.6,
          pointerEvents:
            !AddProblemBoxOpen.is && !DeleteQBox.is ? "all" : "none",
        }}
      >
        {ExamDetails.length === 0
          ? "Failed to load Subject"
          : ExamDetails.subject.name}
      </h1>
      <div
        className="exmCr_1"
        style={{
          opacity: !AddProblemBoxOpen.is && !DeleteQBox.is ? 1 : 0.6,
          pointerEvents:
            !AddProblemBoxOpen.is && !DeleteQBox.is ? "all" : "none",
        }}
      >
        {questions.length !== 0 ? (
          <div
            className="exmCr_1_1"
            style={{
              transform: `translate(0%, ${
                questions.length >= 3 ? 0 : questions.length === 1 ? -30 : -20
              }%)`,
            }}
          >
            <h2 className="exmCr_1_1_tl">All questions</h2>
            <div className="q_cards">
              {questions.map((item, index) => {
                return (
                  <div className="q_crd" key={index}>
                    <h3>{`Q.${index + 1} ${item.text}`}</h3>
                    <div>
                      <p
                        onClick={() => {
                          ToggleAddPrBox({ is: true, editor: index });
                        }}
                      >
                        edit
                      </p>
                      <p
                        onClick={() => {
                          return ToggleDelQBx({ is: true, index: index });
                        }}
                      >
                        remove
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="exmCr_1_1">
            <h2>Start creating your test by clicking here.</h2>
          </div>
        )}
        <div className="exmCr_1_2">
          <div className="exmCr_btns">
            <button
              className="add_prb"
              onClick={() => {
                set_TypeOfAns(0);
                set_PrStat("");
                ToggleAddPrBox({ is: true, editor: -1 });
              }}
            >
              Add Problem +{" "}
            </button>
            <button
              className="pblsh"
              onClick={() => {
                let qq = questions;
                axios
                  .post(
                    Main.url + `/assessments/${ExamId}`,
                    {
                      questions: qq,
                    },
                    {
                      headers: { Authorization: Main.AccessToken },
                    }
                  )
                  .then((response) => {
                    window.location.href = "/dashboard";
                  })
                  .catch((err) => {
                    Main.RefreshAccessToken();
                    Main.toggleErrorBox({
                      is: true,
                      info: "Something's wrong. Try again later.",
                    });
                  });
              }}
            >
              Publish
            </button>
          </div>
          <div className="exmCr_Inst">
            <h1>Instructions</h1>
            <textarea
              value={instructions}
              onChange={(e) => {
                set_instructions(e.target.value);
              }}
              placeholder="Exam instruction goes here..."
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamCreator;
