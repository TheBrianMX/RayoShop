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
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const loadUsers = () => {
    API.get("/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  };

  const handleDelete = async (id: number) => {
    if (confirm("¿Estás seguro de eliminar este usuario?")) {
      try {
        await API.delete(`/users/${id}`);
        loadUsers();
      } catch (err) {
        console.error("Error al eliminar usuario:", err);
      }
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-blue-600">Usuarios</h1>

      <UserForm
        onCreated={loadUsers}
        userToEdit={userToEdit}
        onFinishEdit={() => setUserToEdit(null)}
      />

      <ul className="space-y-2">
        {users.map((user) => (
          <li
            key={user.id}
            className="bg-gray-100 p-3 rounded flex justify-between items-center"
          >
            <div>
              <strong>
                {user.name} {user.lastname}
              </strong>{" "}
              - <span>{user.role}</span>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setUserToEdit(user)}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
