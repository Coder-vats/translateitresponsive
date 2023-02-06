import { useEffect, useState } from "react";
import Arrows from "./components/Arrows";
import Button from "./components/Button";
import Modal from "./components/Modal";
import TextBox from "./components/TextBox";
import axios from "axios";
import { Key, Host } from "./api";

function App() {
  const [showModal, setShowModal] = useState(null);

  const [iCode, setIcode] = useState("en");
  const [oCode, setOcode] = useState("hi");
  const [inputLanguage, setInputLanguage] = useState("English");
  const [outputLanguage, setOutputLanguage] = useState("Hindi");
  const [textToTranslate, setTextToTranslate] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const [languages, setLanguages] = useState(null);

  const getLanguages = async () => {
    const options = {
      method: "GET",
      url: "https://text-translator2.p.rapidapi.com/getLanguages",
      headers: {
        "X-RapidAPI-Key": Key,
        "X-RapidAPI-Host": Host
      }
    };

    axios
      .request(options)
      .then(function (response) {
        setLanguages(response.data.data.languages);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  useEffect(() => {
    getLanguages();
  }, []);

  const translate = () => {
    const encodedParams = new URLSearchParams();
    encodedParams.append("source_language", iCode);
    encodedParams.append("target_language", oCode);
    encodedParams.append("text", textToTranslate);

    const options = {
      method: "POST",
      url: "https://text-translator2.p.rapidapi.com/translate",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "X-RapidAPI-Key": Key,
        "X-RapidAPI-Host": Host
      },
      data: encodedParams
    };

    axios
      .request(options)
      .then(function (response) {
        setTranslatedText(response.data.data.translatedText);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const handleClick = () => {
    setInputLanguage(outputLanguage);
    setOutputLanguage(inputLanguage);
    setIcode(oCode);
    setOcode(iCode);
  };

  return (
    <div className="app">
      {!showModal && (
        <>
          <TextBox
            style="input"
            selectedLanguage={inputLanguage}
            setShowModal={setShowModal}
            setTextToTranslate={setTextToTranslate}
            textToTranslate={textToTranslate}
            setTranslatedText={setTranslatedText}
          />

          <div className="arrow-contain">
            <div className="arrow-container" onClick={handleClick}>
              <Arrows />
            </div>

            <div className="button-container" onClick={translate}>
              <Button />
            </div>
          </div>

          <TextBox
            style="output"
            selectedLanguage={outputLanguage}
            setShowModal={setShowModal}
            translatedText={translatedText}
          />
        </>
      )}

      {showModal && (
        <Modal
          setShowModal={setShowModal}
          languages={languages}
          chosenLanguage={
            showModal === "input" ? inputLanguage : outputLanguage
          }
          setChosenLanguage={
            showModal === "input" ? setInputLanguage : setOutputLanguage
          }
          setCode={showModal === "input" ? setIcode : setOcode}
        />
      )}
    </div>
  );
}

export default App;
