import { React, useState, useEffect, useRef } from "react";
import randomWords from "random-words";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Router from "next/router";
import Link from "next/link";

const NUM_WORDS = 70;
const SECONDS = 60;

export default function Home() {
  const [currentInput, setCurrentInput] = useState("");
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currCharIndex, setCurrCharIndex] = useState(-1);
  const [currChar, setCurrChar] = useState("");
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  ``;
  const [inCorrect, setInCorrect] = useState(0);
  const [status, setStatus] = useState("waiting");

  const router = useRouter();
  const nameRef = useRef();

  function reload() {
    router.reload(window.location.pathname);
  }

  const textInput = useRef(null);
  useEffect(() => {
    setWords(generateWords());
  }, []);

  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);

  function generateWords() {
    return new Array(NUM_WORDS).fill(null).map(() => randomWords());
  }
  const start = () => {
    if (status === "finished") {
      setWords(generateWords());
      setCurrentWordIndex(0);
      setCorrect(0);
      setInCorrect(0);
      setCurrCharIndex(-1);
      setCurrChar("");
    }
    if (status !== "started") {
      setStatus("started");

      let interval = setInterval(() => {
        setCountDown(prevState => {
          if (prevState === 0) {
            clearInterval(interval);
            setStatus("finished");
            setCurrentInput("");
            return SECONDS;
          } else {
            return prevState - 1;
          }
        });
      }, 1000);
    }
  };

  function handleKeyDown({ keyCode, key }) {
    // space bar
    if (keyCode === 32) {
      checkMatch();
      setCurrentInput("");
      setCurrentWordIndex(currentWordIndex + 1);
      setCurrCharIndex(-1);
      // back space
    } else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");
    } else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);
    }
  }

  function checkMatch() {
    const wordToCompare = words[currentWordIndex];
    const doesItMatch = wordToCompare === currentInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);
    } else {
      setInCorrect(inCorrect + 1);
    }
    console.log(doesItMatch);
  }

  function getCharClass(wordIndex, charIdx, char) {
    if (
      wordIndex === currentWordIndex &&
      charIdx === currCharIndex &&
      currChar &&
      status !== "finished"
    ) {
      if (char === currChar) {
        return "success";
      } else {
        return "failed";
      }
    } else if (
      wordIndex === currentWordIndex &&
      currCharIndex >= words[currentWordIndex].length
    ) {
      return "failed";
    } else return "";
  }

  function submitFormHandler(event) {
    event.preventDefault();
    const enteredName = nameRef.current.value;

    const body = {
      name: enteredName,
      score: correct,
      createdAt: new Date().toISOString()
    };
    saveDetails(body);
  }

  async function saveDetails(formDetails) {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(formDetails),
      headers: {
        "Content-Type": "application/json"
      }
    });

    const data = await response.json();

    console.log(data);
  }

  return (
    <>
      <div className={styles.container}>
        {status !== "started" && <h1>WORD RACING GAME</h1>}
        {status === "started" && (
          <div>
            <div className="section">
              <div className="text-center">
                <h1
                  className={
                    countDown > 10 ? styles.seconds : styles.secondsDown
                  }
                >
                  {countDown}
                </h1>
              </div>
              <div className={styles.cards}>
                {words.map((word, i) => (
                  <span className={styles.spacing} key={i}>
                    {word.split("").map((char, idx) => (
                      <span className={getCharClass(i, idx, char)} key={idx}>
                        {char}
                      </span>
                    ))}
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
        <div className={styles.inputAndButton}>
          {status === "started" && (
            <div>
              <input
                ref={textInput}
                type="text"
                onKeyDown={handleKeyDown}
                className={styles.input}
                disabled={status !== "started"}
                value={currentInput}
                onChange={e => setCurrentInput(e.target.value)}
              />
              <div className="center-correct">
                <h3 className="center1">{correct}</h3>
                <h3 className="center2">{inCorrect}</h3>
              </div>
            </div>
          )}
          <div>
            {status !== "finished" && status !== "started" ? (
              <button className={styles.button} onClick={() => start()}>
                start game
              </button>
            ) : (
              <div>
                <button onClick={() => reload()} className={styles.button2}>
                  Play another game
                </button>
                <button
                  onClick={() => Router.push("/user")}
                  type="submit"
                  className={styles.button3}
                >
                  See where you rank
                </button>
              </div>
            )}
          </div>
        </div>

        {/**WHEN THE GAME ENDS */}
        {status === "finished" && (
          <div>
            <div className={styles.gameFinished}>
              <div>
                <p className={styles.wordsPerMinutes}>Words per Minute: </p>
                <p className={styles.score}>{correct}</p>
              </div>
              <div>
                <div className="">
                  <p className={styles.wordsPerMinutes}>Accuracy</p>
                  <p className={styles.score}>
                    {Math.round((correct / (correct + inCorrect)) * 100)} %
                  </p>
                </div>
              </div>
            </div>
            <div className={styles.topPlayer}>
              <form className={styles.form} onSubmit={submitFormHandler}>
                <p>save your score</p>
                <input
                  required
                  id="title"
                  ref={nameRef}
                  type="text"
                  placeholder="Name"
                />
                <button
                  onClick={() => Router.push("/user")}
                  className={styles.button4}
                  type="submit"
                >
                  Save
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
      <div className={styles.footer}>
        {status !== "started" && (
          <div className={styles.footerhead}>
            <h3>INSTRUCTIONS</h3>
            <ul>
              <li>
                Once you click <span className={styles.spec}>START</span> the
                game starts automatically
              </li>
              <li>
                Once you type a particular word click{" "}
                <span className={styles.spec}>SPACE</span> before typing the
                next word in order
              </li>
              <li>You can always go back if the typed letter turns red</li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
