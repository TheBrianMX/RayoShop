import { useEffect, useState } from "react";
import API from "../services/api";
import UserForm from "../components/UserForm";

interface User {
  id: number;
  name: string;
  lastname: string;
  role: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  const loadUsers = () => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id: number) => {
  if (confirm("¿Estás seguro de eliminar este usuario?")) {
    try {
      await API.delete(`/users/${id}`);
      loadUsers(); // recarga la lista
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  }
};


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Usuarios</h1>

      <UserForm onCreated={loadUsers} />

      <ul className="space-y-2">
        {users.map((user) => (
        <li key={user.id} className="bg-gray-100 p-3 rounded flex justify-between items-center">
         <div>
        <strong>{user.name} {user.lastname}</strong> - <span>{user.role}</span>
         </div>
        <button
        onClick={() => handleDelete(user.id)}
        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
         >
           Eliminar
        </button>
        </li>
        ))}
    </ul>
    </div>
  );
}
