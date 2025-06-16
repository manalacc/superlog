export default async function Users() {
  const res = await fetch("https://jsonplaceholder.typicode.com/users");
  const users = await res.json();

  return (
    <div className="flex flex-col gap-4">
      {users.map((user: { id: number; name: string }) => (
        <div key={user.id} className="p-4 border rounded">
          {user.name}
        </div>
      ))}
    </div>
  );
}