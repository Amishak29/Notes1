// src/components/Editor.jsx
import React, { useState, useEffect } from "react";
import ReactQuill from "react-quill";
import axios from "axios";
import "react-quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const Editor = ({ value, setValue }) => {
  const [selectedText, setSelectedText] = useState("");
  const [rephrasedText, setRephrasedText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });

  // API Key from environment variable
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  // Detect selected text and update the popup position
  const handleSelectionChange = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();

    if (selectedText) {
      setSelectedText(selectedText);

      // Calculate popup position
      const range = selection.getRangeAt(0).getBoundingClientRect();
      setPopupPosition({
        top: range.top + window.scrollY, // Adjust for scroll position
        left: range.right + 10, // Position slightly to the right
      });
    } else {
      setSelectedText("");
      setRephrasedText("");
      setSuggestions([]);
    }
  };

  const handleRephrase = async () => {
    if (!selectedText) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions", // Check this endpoint
        {
          model: "text-davinci-003",
          prompt: `Rephrase the following text:\n\n"${selectedText}"`,
          max_tokens: 100,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      setRephrasedText(response.data.choices[0].text.trim());
    } catch (error) {
      toast.error("Failed to rephrase the text.");
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleSuggest = async () => {
    if (!selectedText) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/completions", // Check this endpoint
        {
          model: "text-davinci-003",
          prompt: `Suggest alternative words or phrases for the following text:\n\n"${selectedText}"`,
          max_tokens: 50,
          temperature: 0.7,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      setSuggestions(response.data.choices[0].text.trim().split(", "));
    } catch (error) {
      toast.error("Failed to get word suggestions.");
      console.error(error);
    }
    setIsLoading(false);
  };


  // Decide whether to rephrase or suggest based on word count
  const handleAction = () => {
    const wordCount = selectedText.split(" ").length;
    if (wordCount <= 3) {
      handleSuggest(); // Word suggestions for 1-3 words
    } else {
      handleRephrase(); // Rephrase for longer selections
    }
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleSelectionChange);
    return () => document.removeEventListener("mouseup", handleSelectionChange);
  }, []);

  return (
    <div>
      <ReactQuill
        theme="snow"
        value={value}
        onChange={setValue}
        className="w-full bg-white dark:bg-gray-700 text-black dark:text-white rounded-md"
        placeholder="Write your content here..."
        modules={{
          toolbar: [
            [{ header: "1" }, { header: "2" }, { font: [] }],
            [{ list: "ordered" }, { list: "bullet" }],
            ["bold", "italic", "underline", "strike"],
            [{ align: [] }],
            ["link", "image"],
            ["clean"],
          ],
        }}
        formats={[
          "header", "font", "size",
          "bold", "italic", "underline", "strike",
          "list", "bullet", "align",
          "link", "image",
        ]}
      />

      {selectedText && (
        <div
          style={{
            position: "absolute",
            top: popupPosition.top,
            left: popupPosition.left,
            zIndex: 1000,
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "10px",
            width: "250px",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)"
          }}
          className="dark:bg-gray-800"
        >
          <p className="text-sm font-semibold text-black dark:text-white">
            Selected Text: <span className="italic">{selectedText}</span>
          </p>

          {/* Combined Action Button */}
          <button
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            onClick={handleAction}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Rephrase / Suggest"}
          </button>

          {/* Display Rephrased Text */}
          {rephrasedText && (
            <div className="mt-4">
              <h3 className="font-semibold text-blue-600">Rephrased Text:</h3>
              <p className="text-gray-700 dark:text-gray-300">{rephrasedText}</p>
            </div>
          )}

          {/* Display Word Suggestions */}
          {suggestions.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-green-600">Word Suggestions:</h3>
              <p className="text-gray-700 dark:text-gray-300">
                {suggestions.map((suggestion, index) => (
                  <span key={index} className="inline-block mr-2">
                    {suggestion}
                  </span>
                ))}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Editor;
