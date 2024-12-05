// src/components/PastesList.jsx
import { useSelector, useDispatch } from "react-redux";
import { removeFromPastes } from "../redux/pasteSlice";
import { Eye, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

const PastesList = () => {
  const pastes = useSelector((state) => state.paste.pastes);
  const dispatch = useDispatch();

  const handleDelete = (id) => {
    dispatch(removeFromPastes(id));
  };

  return (
    <div className="w-full px-4 pt-4 flex flex-col gap-y-5">
      {pastes.length > 0 ? (
        pastes.map((paste) => (
          <div key={paste?._id} className="border w-full flex p-4 rounded">
            <div className="flex-grow">
              <h3 className="text-2xl">{paste?.title}</h3>
              <p className="text-gray-600">{paste?.content.substring(0, 50)}...</p>
            </div>
            <div className="flex items-center gap-2">
              <Link to={`/pastes/${paste?._id}`}>
                <Eye size={20} className="text-blue-500" />
              </Link>
              <button onClick={() => handleDelete(paste?._id)}>
                <Trash2 size={20} className="text-red-500" />
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className="text-2xl text-center w-full text-red-500">
          No Data Found
        </div>
      )}
    </div>
  );
};

export default PastesList;
