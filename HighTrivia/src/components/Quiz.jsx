import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setResult, setOptions } from "../redux/action";
import { shuffleArray } from "../utils/array";
import { useHistory, useParams } from "react-router-dom";
import BoxQuiz from "./BoxQuiz";

function Quiz() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { id } = useParams();
  const data = useSelector(state => state.quiz.quiz);
  const options = useSelector(state => state.quiz.options);
  const isViaHome = useSelector(state => state.viaHome);
  const user = JSON.parse(localStorage.getItem("access"));
  const [isClick, setClick] = useState(false);
  const [currentAnswer, setCurrentAnswer] = useState("");

  window.onpopstate = () => {
    // if (window.confirm("Apakah anda yakin?")) {
    //   history.replace("/");
    // } else window.history.forward();
    history.replace("/");
  };

  const onClickOption = (event, correct_answer) => {
    if (!isClick) {
      setCurrentAnswer(event.target.innerText);
      setClick(true);
      dispatch(setResult(event.target.innerText === correct_answer));
    }
  };

  const onClickNext = () => {
    setCurrentAnswer("");
    setClick(false);
    dispatch(setOptions([]));
    if (Number(id) + 1 < data.length) {
      history.replace({
        pathname: `/question/${Number(id) + 1}`
      });
    } else {
      history.replace({
        pathname: "/result",
        state: true
      });
    }
  };

  if (isViaHome) {
    let quiz = {};
    if (data[0] !== undefined) {
      quiz = data[Number(id)];
      const parser = new DOMParser();
      quiz.question = parser.parseFromString(
        quiz.question,
        "text/html"
      ).body.textContent;
      quiz.incorrect_answers = quiz.incorrect_answers.map(item => {
        return parser.parseFromString(item, "text/html").body.textContent;
      });
      quiz.correct_answer = parser.parseFromString(
        quiz.correct_answer,
        "text/html"
      ).body.textContent;
      if (options[0] === undefined) {
        dispatch(
          setOptions(
            shuffleArray([...quiz.incorrect_answers, quiz.correct_answer])
          )
        );
      }
    }

    return (
      <div>
        {data[0] !== undefined ? (
          <BoxQuiz
            quiz={quiz}
            options={options}
            onClickOption={onClickOption}
            username={user.username}
            isClick={isClick}
            onClickNext={onClickNext}
            currentAnswer={currentAnswer}
          />
        ) : (
          <h1>Waiting</h1>
        )}
      </div>
    );
  }

  return <h1>404 not found</h1>;
}

export default Quiz;
