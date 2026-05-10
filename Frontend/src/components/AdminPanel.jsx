import API from "../services/api";

export default function AdminPanel({ users, onChanged }) {
  const promoteUser = async (id, role) => {
    await API.put(`/admin-api/users/${id}/promote`, { role });
    alert(`User promoted to ${role}`);
    onChanged && onChanged();
  };

  const deleteUser = async (id) => {
    await API.delete(`/admin-api/users/${id}`);
    alert("User deleted!");
    onChanged && onChanged();
  };

  return (
    <div className="grid gap-4">
      {users.map(u => (
        <div key={u._id} className="border p-4 rounded shadow">
          <h3 className="font-semibold">{u.firstName} ({u.role})</h3>
          <div className="flex gap-2 mt-2">
            <button onClick={() => promoteUser(u._id, "AUTHOR")} className="bg-blue-500 text-white px-3 py-1 rounded">Promote to Author</button>
            <button onClick={() => promoteUser(u._id, "ADMIN")} className="bg-purple-500 text-white px-3 py-1 rounded">Promote to Admin</button>
            <button onClick={() => deleteUser(u._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
