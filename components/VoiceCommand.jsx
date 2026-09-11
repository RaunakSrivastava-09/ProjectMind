"use client";

import { useEffect, useRef, useState } from "react";
import ConfirmationModal from "./ConfirmationModal";
import CommandResult from "./CommandResult";

export default function VoiceCommand() {
  const [command, setCommand] = useState("");
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [confirmation, setConfirmation] = useState(null);
  const [language, setLanguage] = useState("en-IN");

  const recognitionRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      let transcript = "";

      for (
        let i = event.resultIndex;
        i < event.results.length;
        i++
      ) {
        transcript += event.results[i][0].transcript;
      }

      setCommand(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);

      setListening(false);

      if (event.error === "not-allowed") {
        setResult({
          success: false,
          message:
            "Microphone permission was denied. Please allow microphone access in your browser.",
        });
      } else {
        setResult({
          success: false,
          message:
            "I couldn't hear that clearly. Please try again.",
        });
      }
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, [language]);

  function startListening() {
    if (!recognitionRef.current) {
      setResult({
        success: false,
        message:
          "Speech recognition is not supported in this browser. Please use Google Chrome or Microsoft Edge.",
      });

      return;
    }

    setResult(null);
    setCommand("");

    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error(error);
    }
  }

  function stopListening() {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }

  async function processCommand() {
    const trimmedCommand = command.trim();

    if (!trimmedCommand) {
      setResult({
        success: false,
        message: "Please say or type a command first.",
      });

      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/voice", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          text: trimmedCommand,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong."
        );
      }

    
      if (data.requiresConfirmation) {
        setConfirmation({
          command: data.command,
          projectId: data.projectId,
        });

        return;
      }

      setResult(data);

      speakResponse(data.message);
    } catch (error) {
      console.error(error);

      setResult({
        success: false,
        message:
          error.message ||
          "Unable to process your command.",
      });
    } finally {
      setLoading(false);
    }
  }

  async function confirmCommand() {
    if (!confirmation) return;

    setLoading(true);
    setConfirmation(null);
    setResult(null);

    try {
      const response = await fetch("/api/voice", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          execute: true,

          confirmedCommand:
            confirmation.command,

          projectId:
            confirmation.projectId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to execute command."
        );
      }

      setResult(data);

      speakResponse(data.message);
    } catch (error) {
      console.error(error);

      setResult({
        success: false,
        message:
          error.message ||
          "Unable to execute the command.",
      });
    } finally {
      setLoading(false);
    }
  }

  function cancelCommand() {
    setConfirmation(null);

    setResult({
      success: false,
      message: "Action cancelled.",
    });

    speakResponse("Action cancelled.");
  }

  function speakResponse(message) {
    if (
      typeof window === "undefined" ||
      !window.speechSynthesis ||
      !message
    ) {
      return;
    }

    window.speechSynthesis.cancel();

    const speech =
      new SpeechSynthesisUtterance(message);

    speech.lang = language;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  }

  function handleKeyDown(event) {
    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {
      event.preventDefault();
      processCommand();
    }
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
      
        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl backdrop-blur-xl md:p-8">
         
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm font-medium text-blue-400">
                Voice-to-Command
              </p>

              <h2 className="text-2xl font-bold text-white">
                Talk to your project
              </h2>

              <p className="mt-1 text-sm text-gray-400">
                Speak naturally. ProjectMind understands
                and executes your command.
              </p>
            </div>

          
            <div>
              <label
                htmlFor="language"
                className="mb-1 block text-xs text-gray-500"
              >
                Language
              </label>

              <select
                id="language"
                value={language}
                onChange={(event) =>
                  setLanguage(event.target.value)
                }
                className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white outline-none focus:border-blue-500"
              >
                <option value="en-IN">
                  English
                </option>

                <option value="hi-IN">
                  हिन्दी
                </option>
              </select>
            </div>
          </div>

      
          <div className="mb-6 flex justify-center">
            <button
              type="button"
              onClick={
                listening
                  ? stopListening
                  : startListening
              }
              disabled={loading}
              className={`relative flex h-24 w-24 items-center justify-center rounded-full text-4xl transition-all duration-300 ${
                listening
                  ? "scale-110 bg-red-500 shadow-lg shadow-red-500/30"
                  : "bg-blue-600 shadow-lg shadow-blue-600/30 hover:scale-105 hover:bg-blue-500"
              } ${
                loading
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
            >
              {listening ? "⏹" : "🎙️"}

              {listening && (
                <span className="absolute inset-0 animate-ping rounded-full bg-red-500 opacity-20" />
              )}
            </button>
          </div>

          <p className="mb-6 text-center text-sm text-gray-400">
            {listening
              ? "Listening... speak your command"
              : "Click the microphone and speak"}
          </p>

        
          <div className="relative">
            <textarea
              value={command}
              onChange={(event) =>
                setCommand(event.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder='Try: "Create a snag for the master bathroom ceiling and assign it to the false-ceiling contractor."'
              rows={4}
              className="w-full resize-none rounded-2xl border border-white/10 bg-black/30 p-4 pr-4 text-sm leading-6 text-white outline-none placeholder:text-gray-600 focus:border-blue-500"
            />

            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs text-gray-500">
                Press Enter to execute
              </p>

              <button
                type="button"
                onClick={processCommand}
                disabled={
                  loading ||
                  !command.trim()
                }
                className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {loading
                  ? "Thinking..."
                  : "Run command →"}
              </button>
            </div>
          </div>

       
          <div className="mt-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-500">
              Try these commands
            </p>

            <div className="grid gap-2 sm:grid-cols-2">
              {[
                "Create a snag for the master bathroom ceiling and assign it to the false-ceiling contractor.",
                "Show me all open snags.",
                "Create a task to inspect electrical wiring and assign it to Rahul.",
                "Give me the project status.",
              ].map((example, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() =>
                    setCommand(example)
                  }
                  className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left text-xs leading-5 text-gray-400 transition hover:border-blue-500/40 hover:bg-blue-500/5 hover:text-gray-200"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>
        </div>

       
        {result && (
          <div className="mt-6">
            <CommandResult result={result} />
          </div>
        )}
      </div>

   
      {confirmation && (
        <ConfirmationModal
          command={confirmation.command}
          onConfirm={confirmCommand}
          onCancel={cancelCommand}
          loading={loading}
        />
      )}
    </>
  );
}