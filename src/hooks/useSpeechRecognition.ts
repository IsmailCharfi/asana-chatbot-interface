import { useEffect, useState } from "react";

let recognition: SpeechRecognition | null = null;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.lang = "fr";
}

export const useSpeechRecognition = () => {
  const [result, setResult] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!recognition) {
      return;
    }

    recognition.onresult = (event) => {
      setResult(event.results[0][0].transcript);
      recognition?.stop();
      setIsListening(false);
    };

    recognition.onerror = (ev) => {
      setIsListening(false);
      setResult("");
      setError(true);
    };
  }, []);

  const start = () => {
    if (!recognition) {
      return;
    }

    setResult("");
    setIsListening(true);
    recognition.start();
  };

  const stop = () => {
    if (!recognition) {
      return;
    }

    setIsListening(false);
    recognition.stop();
  };

  return {
    supportsSpeechRecognition: !!recognition,
    error,
    isListening,
    result,
    start,
    stop,
  };
};
