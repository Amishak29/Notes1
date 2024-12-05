import { Copy } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const ViewPaste = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const { id } = useParams();
  const pastes = useSelector((state) => state.paste.pastes);
  const paste = pastes.find((paste) => paste._id === id);

  const [summary, setSummary] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSummarize = async () => {
    if (!paste?.content) {
      toast.error("No content to summarize.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(""); // Reset error message

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a helpful assistant that summarizes text in Markdown format.",
            },
            {
              role: "user",
              content: `Summarize the following text in Markdown format:\n\n"${paste.content}"`,
            },
          ],
          max_tokens: 150,
          temperature: 0.5,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      setSummary(response.data.choices[0].message.content.trim());
    } catch (error) {
      console.error("Error generating summary:", error);
      if (error.response && error.response.status === 429) {
        setErrorMessage("Rate limit reached. Please wait a moment before trying again.");
      } else {
        setErrorMessage("Failed to summarize content.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-5 items-start">
        <input
          type="text"
          placeholder="Title"
          value={paste?.title || ""}
          disabled
          className="w-full text-black border border-input rounded-md p-2"
        />

        <div className="w-full flex flex-col items-start relative rounded bg-opacity-10 border border-[rgba(128,121,121,0.3)] backdrop-blur-2xl">
          <div className="w-full rounded-t flex items-center justify-between gap-x-4 px-4 py-2 border-b border-[rgba(128,121,121,0.3)]">
            <button
              className="p-2 bg-blue-500 text-white rounded"
              onClick={handleSummarize}
              disabled={isLoading}
            >
              {isLoading ? "Summarizing..." : "Summarize"}
            </button>
            <button
              className="flex justify-center items-center transition-all duration-300 ease-in-out group"
              onClick={() => {
                navigator.clipboard.writeText(paste?.content || "");
                toast.success("Copied to Clipboard");
              }}
            >
              <Copy className="group-hover:text-success-500" size={20} />
            </button>
          </div>

          <div className="w-full max-h-[300px] overflow-y-auto p-3 bg-white dark:bg-gray-700 text-black dark:text-white rounded-b">
            {paste?.content || "Write Your Content Here..."}
          </div>
        </div>

        {summary && (
          <div className="w-full mt-5 p-4 border rounded-md bg-gray-100 dark:bg-gray-800 text-black dark:text-white">
            <h2 className="text-xl font-semibold">Summary</h2>
            <div>{summary}</div>
          </div>
        )}

        {errorMessage && (
          <div className="text-red-500 mt-3">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPaste;
