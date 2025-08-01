import { useEffect, useState } from "react";
import API from "../services/api";

interface User {
  id: number;
  name: string;
  lastname: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Usuarios</h1>
      <ul className="space-y-2">
        {users.map((user) => (
          <li key={user.id} className="bg-gray-100 p-3 rounded">
            <strong>{user.name} {user.lastname}</strong> - <span>{user.role}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
