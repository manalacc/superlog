'use client';
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  AddEntryForm,
  AddEntryFormClose,
  AddEntryFormContent,
  AddEntryFormDescription,
  AddEntryFormFooter,
  AddEntryFormHeader,
  AddEntryFormTitle,
  AddEntryFormTrigger,
} from "@/components/ui/AddEntryForm"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar28 } from "@/components/ui/datepicker"
import { Checkbox } from "@/components/ui/checkbox"
import { Combobox } from "@/components/ui/combobox";

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

type Product = {
  id: number;
  title: string;
  images: string[];
};

const PAGE_SIZE = 10;

export default function Page() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(0); // dummyJSON uses skip, not page
  const [loading, setLoading] = useState(false);
  const loader = useRef<HTMLDivElement | null>(null);
  const [date, setDate] = useState<Date>()
  const [completed, setCompleted] = useState(false);

  // Fetch posts and products for the current page
  const fetchData = useCallback(async () => {
    setLoading(true);
    const [postsRes, productsRes] = await Promise.all([
      fetch(`https://dummyjson.com/posts?limit=${PAGE_SIZE}&skip=${page * PAGE_SIZE}`),
      fetch(`https://dummyjson.com/products?limit=${PAGE_SIZE}&skip=${page * PAGE_SIZE}`),
    ]);
    const [postsData, productsData] = await Promise.all([postsRes.json(), productsRes.json()]);
    setPosts((prev) => [...prev, ...postsData.posts]);
    setProducts((prev) => [...prev, ...productsData.products]);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loader.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );
    observer.observe(loader.current);
    return () => observer.disconnect();
  }, [loading]);

  return (
    <div className="flex flex-col items-center gap-8 py-8">
      <AddEntryForm>
        <form>
          <AddEntryFormTrigger asChild>
            <Button variant="outline">Add New Title</Button>
          </AddEntryFormTrigger>
          <AddEntryFormContent className="sm:max-w-[625px]">
            <AddEntryFormHeader>
              <AddEntryFormTitle>Add New Title</AddEntryFormTitle>
            </AddEntryFormHeader>
              <div className="grid grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                  <Calendar28 label="Start Date" />
                </div>
                <div className={`flex flex-col gap-2 ${!completed ? "opacity-50 pointer-events-none" : ""}`}>
                  <Calendar28 label="Finish Date" disabled={!completed} />
                </div>
                <div className="flex flex-col items-center justify-center gap-2">
                  <Label htmlFor="checkbox-1" className="text-center">Completed</Label>
                  <Checkbox
                    id="checkbox-1"
                    checked={completed}
                    onCheckedChange={checked => setCompleted(checked === true)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-[150px_1fr] gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="combobox-1">Type</Label>
                  <Combobox/>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name-1">Title</Label>
                  <Input id="name-1" name="name" defaultValue="" />
                </div>
              </div>
            <AddEntryFormFooter>
              <AddEntryFormClose asChild>
                <Button variant="outline">Cancel</Button>
              </AddEntryFormClose>
              <Button type="submit">Save changes</Button>
            </AddEntryFormFooter>
          </AddEntryFormContent>
        </form>
      </AddEntryForm>
      {posts.map((post, idx) => (
        <div
          key={`${post.id}-${idx}`}
          className="w-full max-w-xl bg-white dark:bg-gray-900 rounded-xl shadow p-6 flex gap-4"
        >
          <img
            src={products[idx]?.images?.[0]}
            alt={products[idx]?.title}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h2 className="font-bold text-lg">{post.title}</h2>
            <p className="text-gray-700 dark:text-gray-300">{post.body}</p>
          </div>
        </div>
      ))}
      <div ref={loader} className="h-10 flex items-center justify-center">
        {loading && <span>Loading...</span>}
      </div>
    </div>
  );
}