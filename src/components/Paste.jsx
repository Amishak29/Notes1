import { Calendar, Copy, Eye, PencilLine, Trash2, Share } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react"; 
import { removeFromPastes } from "../redux/pasteSlice";
import { FormatDate } from "../utlis/formatDate";
import { Link } from "react-router-dom";

const Paste = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = (id) => {
    dispatch(removeFromPastes(id));
  };

  const filteredPastes = pastes.filter((paste) =>
    paste.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShare = (paste) => {
    if (navigator.share) {
      navigator
        .share({
          title: paste.title,
          text: paste.content,
          url: window.location.origin + `/pastes/${paste._id}`,
        })
        .then(() => toast.success("Shared successfully!"))
        .catch((error) => toast.error("Share failed: " + error.message));
    } else {
      toast.error("Sharing is not supported in this browser.");
    }
  };

  return (
    <div className="w-full h-full py-10 max-w-[1200px] mx-auto px-5 lg:px-0">
      <div className="flex flex-col gap-y-3">
        {/* Search */}
        <div className="w-full flex gap-3 px-4 py-2 rounded-lg border border-gray-300 mt-6 bg-white dark:bg-gray-700 shadow-md">
          <input
            type="search"
            placeholder="Search paste here..."
            className="focus:outline-none w-full bg-transparent text-black dark:text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* 3xN Grid for All Pastes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {filteredPastes.length > 0 ? (
            filteredPastes.map((paste) => (
              <div
                key={paste?._id}
                className="border border-gray-300 p-4 rounded-lg bg-white dark:bg-gray-700 flex flex-col justify-between shadow-lg transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Title and Content */}
                <div>
                  <p className="text-2xl font-semibold text-black dark:text-white mb-2">
                    {paste?.title}
                  </p>
                  <p className="text-sm font-normal line-clamp-3 text-gray-700 dark:text-gray-300">
                    {paste?.content}
                  </p>
                </div>

                {/* Action Icons and Date */}
                <div className="mt-4">
                  <div className="flex gap-2 justify-between items-center mb-3">
                    <button
                      className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800 transition-colors duration-200"
                    >
                      <Link to={`/?pasteId=${paste?._id}`}>
                        <PencilLine size={20} />
                      </Link>
                    </button>
                    <button
                      className="p-2 rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800 transition-colors duration-200"
                      onClick={() => handleDelete(paste?._id)}
                    >
                      <Trash2 size={20} />
                    </button>
                    <button className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-700 text-white hover:from-orange-600 hover:to-orange-800 transition-colors duration-200">
                      <Link to={`/pastes/${paste?._id}`} target="_blank">
                        <Eye size={20} />
                      </Link>
                    </button>
                    <button
                      className="p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-700 text-white hover:from-green-600 hover:to-green-800 transition-colors duration-200"
                      onClick={() => {
                        navigator.clipboard.writeText(paste?.content);
                        toast.success("Copied to Clipboard");
                      }}
                    >
                      <Copy size={20} />
                    </button>
                    <button
                      className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800 transition-colors duration-200"
                      onClick={() => handleShare(paste)}
                    >
                      <Share size={20} />
                    </button>
                  </div>
                  <div className="flex items-center text-gray-500 dark:text-gray-400 mt-2">
                    <Calendar size={20} />
                    <span className="ml-2">{FormatDate(paste?.createdAt)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-2xl text-center w-full text-red-500 dark:text-red-300">
              No Data Found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Paste;
