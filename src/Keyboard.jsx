import React, { useState, useEffect } from "react";
import "./Keyboard.css";

const KeyboardApp = () => {
  const [currentKey, setCurrentKey] = useState("");
  const [nextKey, setNextKey] = useState("");
  const [typedKeys, setTypedKeys] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [keysPressed, setKeysPressed] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [prevKeysPressed, setPrevKeysPressed] = useState(0);
  const [totalKeysPressed, setTotalKeysPressed] = useState(0);

  useEffect(() => {
    setNextKey(getRandomKey());
    setStartTime(new Date());

    const practiceTimer = setTimeout(() => {
      handlePracticeEnd();
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(practiceTimer);
    };
  }, []);

  useEffect(() => {
    if (startTime && endTime) {
      const durationInMs = endTime - startTime;
      const durationInMinutes = durationInMs / (1000 * 60);
      const keysPerMinute = totalKeysPressed / durationInMinutes;
      console.log("Keys per minute:", keysPerMinute);
    }
  }, [endTime]);

  const handleKeyPress = (event) => {
    const { key } = event;

    if (!["a", "s", "d", "f", "j", "k", "l", ";"].includes(key)) {
      return;
    }

    setCurrentKey(key);
    setTypedKeys((prevKeys) => prevKeys + key);
    setKeysPressed((prevKeysPressed) => prevKeysPressed + 1);
    setTotalKeysPressed((prevTotalKeysPressed) => prevTotalKeysPressed + 1);

    if (key !== nextKey) {
      setAccuracy(
        (prevAccuracy) => ((prevKeysPressed - 1) / prevKeysPressed) * 100
      );
    }

    setPrevKeysPressed(keysPressed);
    setNextKey(getRandomKey());
  };

  const getRandomKey = () => {
    const keys = ["a", "s", "d", "f", "j", "k", "l", ";"];
    return keys[Math.floor(Math.random() * keys.length)];
  };

  const calculateAccuracy = () => {
    const totalKeys = typedKeys.length;
    const incorrectKeys = typedKeys
      .split("")
      .filter((key, index) => key !== nextKey[index]).length;
    const calculatedAccuracy = ((totalKeys - incorrectKeys) / totalKeys) * 100;
    setAccuracy(calculatedAccuracy.toFixed(2));
  };

  const handlePracticeEnd = () => {
    setEndTime(new Date());
    calculateAccuracy();
  };

  return (
    <div className="keyboard-app">
      <h1>Touch Typing Practice</h1>
      <div className="keys-press">
        <p>Current Key: {currentKey}</p>
        <p>Next Key: {nextKey}</p>
        <p>Typed Keys: {typedKeys}</p>
      </div>
      <input type="text" className="typing-input" onKeyDown={handleKeyPress} />

      <p>Keys Pressed: {keysPressed}</p>
      {endTime ? <p>Accuracy: {accuracy}%</p> : null}
      {endTime ? (
        <p>
          Practice Duration: {Math.round((endTime - startTime) / 1000)} seconds
        </p>
      ) : null}
      {endTime ? <p>Keys Pressed in 5 Minutes: {totalKeysPressed}</p> : null}
      {endTime ? null : <p>Practice in progress...</p>}
      {endTime ? null : (
        <button onClick={handlePracticeEnd}>End Practice</button>
      )}
    </div>
  );
};

export default KeyboardApp;
