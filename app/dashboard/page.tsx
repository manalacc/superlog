'use client';
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  AddEntryForm,
  AddEntryFormClose,
  AddEntryFormContent,
  AddEntryFormFooter,
  AddEntryFormHeader,
  AddEntryFormTitle,
  AddEntryFormTrigger,
} from "@/components/ui/AddEntryForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar28 } from "@/components/ui/datepicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import { Ranking } from "@/components/ui/ranking";
import { useSession } from "next-auth/react";

type Post = {
  id: number;
  title: string;
  image?: string;
  startDate: string;
  finishDate?: string;
  completed: boolean;
  timeSpent: number;
  type: string;
  ranking: string;
};

export default function Page() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [ranking, setRanking] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [finishDate, setFinishDate] = useState<Date | null>(null);
  const [completed, setCompleted] = useState(false);
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);

  // Fetch entries from the API
  const fetchData = useCallback(async () => {
    setLoading(true);
    // Fetch all entries, no email filter
    const res = await fetch(`/api/entries?hasEmail=true`);
    const data = await res.json();
    setPosts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Infinite scroll observer (optional, can be removed if not needed)
  useEffect(() => {
    if (!loader.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          // You can implement pagination here if your API supports it
        }
      },
      { threshold: 1 }
    );
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loading]);

  // Handle dialog-based submission
  const handleDialogSubmit = async () => {
    setLoading(true);

    const entryData = {
      title,
      type,
      ranking,
      startDate: startDate ? startDate.toISOString() : null,
      finishDate: finishDate ? finishDate.toISOString() : null,
      completed,
      timeSpent: Number(timeSpent),
      image: null
    };

    const res = await fetch("/api/entries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(entryData),
    });

    if (res.ok) {
      fetchData();
      setDialogOpen(false); // Only close after success
      // Reset fields
      setTitle("");
      setType("");
      setRanking("");
      setStartDate(null);
      setFinishDate(null);
      setCompleted(false);
      setTimeSpent(0);
      setImage(null);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <AddEntryForm open={dialogOpen} onOpenChange={setDialogOpen}>
        <AddEntryFormTrigger asChild>
          <Button variant="outline">Add New Title</Button>
        </AddEntryFormTrigger>
        <AddEntryFormContent className="sm:max-w-[950px]">
          <AddEntryFormHeader>
            <AddEntryFormTitle>Add New Title</AddEntryFormTitle>
          </AddEntryFormHeader>
          <div className="grid grid-cols-[100px_1fr] gap-6">
            {/* Image upload square column */}
            <div className="flex flex-col items-center justify-center">
              <Label htmlFor="entry-image" className="text-center mb-2">Thumbnail</Label>
              <div className="w-24 h-24 border border-dashed border-gray-300 rounded-md flex items-center justify-center bg-gray-50 relative">
                <input
                  type="file"
                  id="entry-image"
                  name="entry-image"
                  accept="image/*"
                  onChange={e => setImage(e.target.files?.[0] || null)}
                  className="opacity-0 absolute w-full h-full cursor-pointer"
                  title=""
                />
                <span className="text-2xl text-gray-400 pointer-events-none absolute">+</span>
              </div>
            </div>
            {/* Main form fields */}
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-[1fr_1fr_80px_1fr] gap-4">
                <div className="flex flex-col gap-2">
                  <Calendar28 label="Start Date" value={startDate} onChange={setStartDate} />
                </div>
                <div className={`flex flex-col gap-2 ${!completed ? "opacity-50 pointer-events-none" : ""}`}>
                  <Calendar28 label="Finish Date" value={finishDate} onChange={setFinishDate} disabled={!completed} />
                </div>
                <div className="flex flex-col gap-4 items-center pt-1">
                  <Label htmlFor="checkbox-1" className="text-center">Completed</Label>
                  <Checkbox
                    id="checkbox-1"
                    checked={completed}
                    onCheckedChange={checked => setCompleted(checked === true)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="timespent" className="text-center">Time Spent (hours)</Label>
                  <div className="relative">
                    <Input
                      type="number"
                      id="timespent"
                      name="timespent"
                      min={0}
                      step={0.1}
                      placeholder="0.00"
                      value={timeSpent}
                      onChange={e => setTimeSpent(Number(e.target.value))}
                      className="pr-12"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm pointer-events-none">hrs</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-[150px_1fr_150px] gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="combobox-1">Type</Label>
                  <Combobox value={type} onChange={setType} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name-1">Title</Label>
                  <Input
                    id="name-1"
                    name="name"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="ranking">Ranking</Label>
                  <Ranking value={ranking} onChange={setRanking} />
                </div>
              </div>
            </div>
          </div>
          <AddEntryFormFooter>
            <AddEntryFormClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </AddEntryFormClose>
            <Button
              type="button"
              disabled={loading}
              onClick={handleDialogSubmit}
            >
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </AddEntryFormFooter>
        </AddEntryFormContent>
      </AddEntryForm>
      {posts.map((post, idx) => (
        <div
          key={post.id}
          className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex gap-4"
        >
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="font-bold text-lg">{post.title}</h2>
            <p className="text-gray-700 dark:text-gray-300">Type: {post.type}</p>
            <p className="text-gray-700 dark:text-gray-300">Ranking: {post.ranking}</p>
            <p className="text-gray-700 dark:text-gray-300">Completed: {post.completed ? "Yes" : "No"}</p>
            <p className="text-gray-700 dark:text-gray-300">Time Spent: {post.timeSpent} hrs</p>
            <p className="text-gray-700 dark:text-gray-300">Start: {post.startDate}</p>
            <p className="text-gray-700 dark:text-gray-300">Finish: {post.finishDate}</p>
          </div>
        </div>
      ))}
      <div ref={loader} className="h-10 flex items-center justify-center">
        {loading && <span>Loading...</span>}
      </div>
    </div>
  );
}