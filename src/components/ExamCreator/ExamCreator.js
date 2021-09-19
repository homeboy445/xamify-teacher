import React, { useState, useEffect } from "react";
import "./ExamCreator.css";

const ExamCreator = () => {
  const [questions, set_questions] = useState([
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
  ]);
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

  useEffect(() => {
    let idx = AddProblemBoxOpen.editor;
    if (idx !== -1) {
      set_TypeOfAns(questions[idx].type === "MCQ" ? 0 : 1);
      set_PrStat(questions[idx].question);
      if (questions[idx].type === "MCQ") {
        set_MxChoice(questions[idx].choices.length);
      }
    }
  }, [questions, AddProblemBoxOpen]);

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
              console.log(q1);
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
              <h3>Type</h3>
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
                  question: ProblemStatement,
                  type: TypeOfAnswering === 0 ? "MCQ" : "Type",
                });
              } else {
                qObj[n - 1].question = ProblemStatement;
                qObj[n - 1].type = TypeOfAnswering === 0 ? "MCQ" : "Type";
              }
              if (TypeOfAnswering === 0) {
                if (choice1.trim() === "" && choice2 === "") {
                  return;
                }
                qObj[n - 1]["choices"] = [choice1, choice2];
                if (MaxChoice >= 3) {
                  if (choice3.trim() === "") {
                    return;
                  }
                  qObj[n - 1].choices.push(choice3);
                }
                if (MaxChoice === 4) {
                  if (choice4.trim() === "") {
                    return;
                  }
                  qObj[n - 1].choices.push(choice4);
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
        Operating Systems
      </h1>
      <div
        className="exmCr_1"
        style={{
          opacity: !AddProblemBoxOpen.is && !DeleteQBox.is ? 1 : 0.6,
          pointerEvents:
            !AddProblemBoxOpen.is && !DeleteQBox.is ? "all" : "none",
        }}
      >
        <div className="exmCr_1_1">
          <h2>All questions</h2>
          <div className="q_cards">
            {questions.map((item, index) => {
              return (
                <div className="q_crd">
                  <h3>{`Q.${index + 1} ${item.question}`}</h3>
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
        <div className="exmCr_1_2">
          <div className="exmCr_btns">
            <button
              className="add_prb"
              onClick={() => ToggleAddPrBox({ is: true, editor: -1 })}
            >
              Add Problem +{" "}
            </button>
            <button className="pblsh">Publish</button>
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
