const renderList = (list, title) => (
  <>
    <h3 className="text-lg font-semibold mt-6 mb-2">{title}</h3>

    {list.length === 0 ? (
      <p className="text-gray-500">No data found</p>
    ) : (
      list.map((user) => (
        <div
          key={user.email || user._id}
          className="border p-4 mb-3 rounded flex justify-between items-center"
        >
          <div>
            {/* FIXED: Use firstName and lastName */}
            <p className="font-medium">
              {user.firstName} {user.lastName || ''}
            </p>
            <p className="text-sm text-gray-500">{user.email}</p>
            <p>Status: {user.isUserActive ? "Active" : "Blocked"}</p>
          </div>

          <button
            onClick={() => toggleStatus(user)}
            className={`px-4 py-2 text-white rounded ${
              user.isUserActive ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {user.isUserActive ? "Block" : "Unblock"}
          </button>
        </div>
      ))
    )}
  </>
);

// Also update the header section
<div>
  <p className="text-sm text-gray-500">Admin Panel</p>
  <h2 className="text-xl font-semibold">
    {currentUser?.firstName} {currentUser?.lastName || ''}
  </h2>
  <p className="text-sm text-gray-500">{currentUser?.email}</p>
</div>
