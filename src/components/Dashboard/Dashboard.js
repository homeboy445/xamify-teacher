import React, { useState, useEffect, useContext } from "react";
import "./Dashboard.css";
import AuthContext from "../../Context";
import axios from "axios";
import { Link } from "react-router-dom";
import Accordion from "@mui/material/Accordion";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import Button from "@mui/material/Button";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '40%', // Set your desired width here
    maxWidth: 'none', // Optional: disables default max-width
  },
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const Dashboard = () => {
  const Main = useContext(AuthContext);
  const [AssessmentGrouped, update_group] = useState([]);
  const [AllAssessment, update_Details] = useState([]);
  const [fetchedData, updateStatus] = useState(false);
  const [Show_Active, set_SActive] = useState(true);
  const [Show_Upcoming, set_SUpcoming] = useState(true);
  const [Show_Previous, set_PAttempted] = useState(true);
  const [DetailBox, toggleDetailBox] = useState({
    is: false,
    object: {
      subject: {
        name: "empty",
        year: { label: "1st year" },
      },
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
    },
  });

  const getDuration = (obj) => {
    let d1 = new Date(obj.startTime),
      d2 = new Date(obj.endTime);
    let diff = Math.floor((d2 - d1) / 60e3);
    return `${Math.floor(diff / 60)} hours ${diff % 60} minutes`;
  };

  const renderAccordion = ({ title, children, onChangeCallback }) => {
    console.log(">> children", children);
    return (
      <Accordion
        sx={{
          height: "100%",
          color: "white",
          border: "1px solid cyan",
        }}
        disabled={children.length === 0 || children[0] === null}
        onChange={onChangeCallback}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{
            fontFamily: "Roboto",
            background: "var(--primary-color)",
          }}
        >
          <Typography sx={{ fontSize: "2rem" }} component="span">
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    );
  };

  const renderExamDetailsDialogBox = ({
    showDialog = false,
    handleClose = () => {},
  }) => {
    if (!DetailBox.is) {
      return null;
    }
    return (
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={showDialog}
      >
        <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
          Exam Details
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={(theme) => ({
            position: "absolute",
            right: 8,
            top: 8,
            color: theme.palette.grey[500],
          })}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent dividers>
          <Typography gutterBottom>
            <h2 className="detail-section">
              Date of the Exam: 
              <span>
                {`${new Date(
                  DetailBox.object.startTime
                ).toDateString()} (${new Date(
                  DetailBox.object.startTime
                ).toLocaleTimeString()})`}
              </span>
            </h2>
          </Typography>
          <Typography gutterBottom>
            <h2 className="detail-section">
              Duration of the Exam: 
              <span> {getDuration(DetailBox.object)} </span>
            </h2>
          </Typography>
          <Typography gutterBottom>
            <h2 className="detail-section">
              Subject of the Exam: 
              <span> {DetailBox.object.subject.name} </span>
            </h2>
          </Typography>
          <Typography gutterBottom>
            <h2 className="detail-section">
              For students of year: 
              <span> {DetailBox.object.subject.year.label} </span>
            </h2>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleClose}>
            Understood
          </Button>
        </DialogActions>
      </BootstrapDialog>
    );
  };

  useEffect(() => {
    if (Main.AccessToken !== null && !Main.isError.is && !fetchedData) {
      Main.toggleLoader(true);
      axios
        .get(Main.url + "/assessments", {
          headers: { Authorization: Main.AccessToken },
        })
        .then((response) => {
          let obj = [];
          response.data.map((item) => {
            if (item.author.email !== Main.userInfo.email) {
              return null;
            }
            let d1 = new Date(item.startTime),
              d2 = new Date(item.endTime);
            let duration = Math.floor((d2 - d1) / 60e3);
            let dN = new Date();
            let diff = Math.floor((d1 - dN) / 60e3); //Subtracting start date with current date
            if (diff > 0) {
              //If the difference is +ve then put into upcoming catg
              obj.push({ upcoming: item });
            } else {
              //If not,
              if (duration >= Math.abs(diff)) {
                // Check if it's duration greater...
                obj.push({ active: item });
              } else {
                //Else do this...
                obj.push({ previous: item });
              }
            }
            return null;
          });
          update_Details(response.data);
          update_group(obj);
          updateStatus(true);
          Main.toggleLoader(false);
        })
        .catch((err) => {
          Main.RefreshAccessToken();
        });
    }
  }, [Main, AssessmentGrouped]);

  return (
    <div className="dashboard">
      {renderExamDetailsDialogBox({
        showDialog: DetailBox.is,
        handleClose: () => {
          toggleDetailBox({ is: false, object: {} });
        },
      })}
      <div
        className="db-titl"
        style={{
          opacity: DetailBox.is ? 0.4 : 1,
          pointerEvents: DetailBox.is ? "none" : "all",
        }}
      >
        <h1 className="d-title"> Dashboard </h1>{" "}
        <button onClick={() => (window.location.href = "/examdetails")}>
          Create Tests +
        </button>{" "}
      </div>{" "}
      <div
        className="dashboard-1"
        style={{
          opacity: DetailBox.is ? 0.4 : 1,
          pointerEvents: DetailBox.is ? "none" : "all",
        }}
      >
        <div className="Active">
          {renderAccordion({
            title: "Active Tests",
            onChangeCallback: () => {
              set_SActive(!Show_Active);
            },
            children: AssessmentGrouped.map((item, index) => {
              if (!("active" in item)) {
                return null;
              }
              return (
                <div key={index} className="db-card">
                  <h2> {item.active.subject.name} </h2>{" "}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <p
                      onClick={() => {
                        let obj = AllAssessment.find(
                          (item1) => item1.id === item.active.id
                        );
                        toggleDetailBox({ is: true, object: obj });
                      }}
                      style={{
                        marginRight: "1rem",
                        color: "darkblue",
                        fontWeight: "bolder",
                      }}
                    >
                      Info
                    </p>
                    <Link
                      to={`/submissions/${item.active.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <p
                        style={{
                          marginRpight: "0.5rem",
                          color: "darkgreen",
                          fontWeight: "bolder",
                        }}
                      >
                        Submissions{" "}
                      </p>
                    </Link>{" "}
                  </div>
                </div>
              );
            }),
          })}
        </div>
        <div className="Upcoming">
          {renderAccordion({
            title: "Upcoming Tests",
            onChangeCallback: () => {
              set_SUpcoming(!Show_Upcoming);
            },
            children: AssessmentGrouped.map((item, index) => {
              if (!("upcoming" in item)) {
                return null;
              }
              return (
                <div key={index} className="db-card">
                  <h2> {item.upcoming.subject.name} </h2>
                  <p
                    onClick={() => {
                      let obj = AllAssessment.find(
                        (item1) => item1.id === item.upcoming.id
                      );
                      toggleDetailBox({ is: true, object: obj });
                    }}
                  >
                    Details
                  </p>
                </div>
              );
            }),
          })}
        </div>
        <div className="Attempted">
          {renderAccordion({
            title: "Previously hosted tests",
            onChangeCallback: () => {
              set_PAttempted(!Show_Previous);
            },
            children: AssessmentGrouped.map((item, index) => {
              if (!("previous" in item)) {
                return null;
              }
              return (
                <div
                  key={index}
                  className="db-card"
                  style={{
                    transform: !Show_Previous
                      ? `translate(0%,${-20 - index * 25}%)`
                      : "translate(0%,0%)",
                    opacity: Show_Previous ? 1 : 0,
                    marginBottom: Show_Previous ? "0%" : "-25%",
                    transition: "0.8s ease",
                    backgroundColor: !Show_Previous ? "transparent" : "#cde4f6",
                  }}
                >
                  <h2> {item.previous.subject.name} </h2>{" "}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <p
                      onClick={() => {
                        let obj = AllAssessment.find(
                          (item1) => item1.id === item.previous.id
                        );
                        toggleDetailBox({ is: true, object: obj });
                      }}
                      style={{
                        marginRight: "1rem",
                        color: "darkblue",
                        fontWeight: "bolder",
                      }}
                    >
                      Details
                    </p>
                    <Link
                      to={`/submissions/${item.previous.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <p
                        style={{
                          marginRight: "0.5rem",
                          color: "darkgreen",
                          fontWeight: "bolder",
                        }}
                      >
                        Submissions{" "}
                      </p>
                    </Link>{" "}
                  </div>
                </div>
              );
            }),
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
