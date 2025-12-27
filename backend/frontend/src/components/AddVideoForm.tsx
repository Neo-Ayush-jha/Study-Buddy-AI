import { useState } from "react";
import { addYoutubeVideo } from "@/lib/api";
import { toast } from "sonner";

const AddVideoForm = () => {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [title, setTitle] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await addYoutubeVideo(youtubeUrl, title);
      toast.success(res.message || "Video added successfully");
      setYoutubeUrl("");
      setTitle("");
    } catch (err) {
      toast.error("Failed to add video. Please check the URL and backend.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h2 className="font-serif text-xl mb-2">Add Video</h2>
      <div className="mb-2">
        <label className="block mb-1">YouTube URL:</label>
        <input
          type="url"
          value={youtubeUrl}
          onChange={(e) => setYoutubeUrl(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>
      <div className="mb-2">
        <label className="block mb-1">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="border p-2 w-full"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Video
      </button>
    </form>
  );
};

export default AddVideoForm;
