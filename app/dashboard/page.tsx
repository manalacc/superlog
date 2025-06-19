'use client';
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState, useCallback } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
      <Dialog>
        <form>
          <DialogTrigger asChild>
            <Button variant="outline">+</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you&apos;re
                done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="username-1">Username</Label>
                <Input id="username-1" name="username" defaultValue="@peduarte" />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </DialogContent>
        </form>
      </Dialog>
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