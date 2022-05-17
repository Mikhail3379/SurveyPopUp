import React, { useState } from "react";
import { CloseButton, ProgressBar } from "react-bootstrap";
import { Modal } from "reactstrap";
import "react-step-progress-bar/styles.css";
import "./help.css";
export default function HelpModal({ isOpen, handleClose, errText }: any) {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [now, setNow] = useState(20);
  // eslint-disable-next-line no-restricted-globals
  const [myAnswers, setMyAnswers] = useState(new Array(length).fill(""));
  const [final, setFinal] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const isValidStep = () => {
    return myAnswers[currentStep];
  };

  const moveBar = (e: any) => {
    e.preventDefault();
    if (!isValidStep()) return;
    const btnNextActive = document.getElementById("btnNextActive");
    if (!btnNextActive) return;
    setCurrentStep(currentStep + 1);
    setNow(now + 16);
    btnNextActive.style.background = `linear-gradient(91.87deg, #4500FF 0%, #38FFBD 100%)`;
    // if it's the final question then call the function decide
    // if it's the final question then call the function saveData
    if (currentStep == dataFromMongo.length - 1) {
      decide(myAnswers[currentStep]);
      saveData();
    }
  };
  const skip = (e: any) => {
    e.preventDefault();
    if (currentStep == dataFromMongo.length - 2) {
      setIsComplete(true);
    }

    setCurrentStep(currentStep + 1);
    setNow(now + 16);
    saveData();
  };
  const saveData = () => {
    window.localStorage.setItem("myAnswers", JSON.stringify(myAnswers));
    // let  myanswers=window.localStorage.getItem("myAnswers");
  };
  const decide = (answer: string) => {
    if (answer === "Yay") setFinal(1);
    else setFinal(2);
  };
  const saveAnswer = (answer: string) => {
    const answers = [...myAnswers];
    answers[currentStep] = answer;
    setMyAnswers(answers);
  };

  const saveCustomAnswer = (event: any) => {
    const value = event.target.value;
    saveAnswer(value);
  };
  // const lastQuestion = () => {
  //   if (currentStep == dataFromMongo.length - 1) return;
  // };

  const displayQA = () => {
    const { question, answers = [] } = dataFromMongo[currentStep];

    return (
      <>
        <h1 className="question">{question}</h1>
        {answers.map((answer, index) => {
          return (
            <div className="form-group d-flex align-items-center">
              <input
                type="radio"
                name={`answer${currentStep}`}
                required={true}
                id={`answer${index}`}
                className="form-control"
                defaultChecked={false}
                onClick={() => saveAnswer(answer)}
              />
              <label
                htmlFor={`answer${index}`}
                //
                className="answer"
              >
                {answer}
              </label>
              {answer.toLowerCase() === "other" && (
                <input
                  type="text"
                  required={true}
                  id={"customAnswer"}
                  onChange={(event) => saveCustomAnswer(event)}
                />
              )}
            </div>
          );
        })}
      </>
    );
  };
  return (
    <>
      <Modal isOpen={isOpen} className="modalcontent" backdrop={true}>
        <div className="modalbody modalbodyHelpModal">
          <CloseButton onClick={() => handleClose()} />
          {!final && <h1 className="modalTitle">HELP US HELP YOU BETTER!</h1>}

          {!final && <ProgressBar variant="success" now={now} />}

          {!final && displayQA()}
          {final == 1 && (
            <div>
              <h1>We will contact you at this address</h1>
              <input
                type="text"
                placeholder="Enter your email"
                required={true}
                id={"customAnswer"}
                onChange={(event) => saveCustomAnswer(event)}
              />
              <button onClick={() => handleClose()} className="btn buttonFinal">
                Finish
              </button>
              <h3>
                More to say? Write us at &nbsp;
                <a
                  href="mailto:team@novafinance.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="email"
                >
                  team@novafinance.app
                </a>
              </h3>
            </div>
          )}
          {final == 2 && (
            <div>
              <h1>That's ok &nbsp; 👌</h1>
              <button onClick={() => handleClose()} className="btn buttonFinal">
                Finish
              </button>
              <h3>
                More to say? Write us at &nbsp;
                <a
                  href="mailto:team@novafinance.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="email"
                >
                  team@novafinance.app
                </a>
              </h3>
            </div>
          )}

          {!final && (
            <div className="containerButtons">
              <button
                id="btnNextActive"
                className="btn buttonNext"
                onClick={moveBar}
                disabled={!isValidStep()}
              >
                NEXT
              </button>
              <br />
              {!isComplete && (
                <button onClick={skip} className="btn skipButton">
                  Skip
                </button>
              )}
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
const dataFromMongo = [
  {
    question: "How confident are you in crypto?",
    answers: [
      "I know nothing or almost nothing",
      "I've done some research",
      "I own some crypto",
      "I regularly trade and/or invest in crypto",
    ],
  },
  {
    question: "Have you ever invested in crypto or non-crypto?",
    answers: [
      "Never",
      "Yes,but I don't know how it works",
      "Yes,by choosing portfolios that are best for me",
      "I design my own investment strategies",
    ],
  },
  {
    question: "Do you regularly save money?",
    answers: [
      "Never",
      "Sometimes",
      "I save what I don't spend",
      "I'm actively saving for a specific goal",
    ],
  },
  {
    question: "Why are you interested in crypto?",
    answers: [
      "I'm not sure I'm",
      "I want to see what all the excitement is about",
      "DeFi is growing and I don't want to miss it",
      "I want to put most of my capital in crypto",
      "Other",
    ],
  },
  {
    question: "Are you active in the crypto community?",
    answers: [
      "No",
      "I consume other users content",
      "I leave comments and engage with other crypto enthusiasts",
      "I engage and create educational content for less experienced users",
    ],
  },
  {
    question: "Would you like to take part in exciting product testing?",
    answers: ["Yay", "Nay"],
  },
];
