
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const PasteView = () => {
  const { id } = useParams();
  const paste = useSelector((state) => state.paste.pastes.find((p) => p._id === id));

  if (!paste) {
    return <div className="text-center text-2xl">Paste not found</div>;
  }

  return (
    <div className="w-full h-full p-10">
      <h2 className="text-4xl">{paste.title}</h2>
      <div className="mt-4 text-lg">{paste.content}</div>
    </div>
  );
};

export default PasteView;
