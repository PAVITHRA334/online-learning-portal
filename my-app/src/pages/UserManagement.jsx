import React, { useEffect, useState } from 'react';

const BASE_URL = "http://localhost:5000";

const styles = {
  container: {
    maxWidth: 700,
    margin: "30px auto",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: 20,
    background: "#fefefe",
    borderRadius: 8,
    boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  error: {
    color: "#d93025",
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "12px 15px",
    backgroundColor: "#1a73e8",
    color: "white",
    fontWeight: "600",
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #ddd",
    verticalAlign: "middle",
  },
  trHover: {
    backgroundColor: "#f5f8ff",
  },
  button: {
    padding: "6px 12px",
    marginRight: 8,
    borderRadius: 5,
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    transition: "background-color 0.3s ease",
  },
  roleBtn: {
    backgroundColor: "#1a73e8",
    color: "white",
  },
  roleBtnHover: {
    backgroundColor: "#1669c1",
  },
  deleteBtn: {
    backgroundColor: "#d93025",
    color: "white",
  },
  deleteBtnHover: {
    backgroundColor: "#b2221a",
  },
};

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const load = () => {
    fetch(`${BASE_URL}/users`)
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then((data) => setUsers(data))
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = (id) => {
    fetch(`${BASE_URL}/users/${id}`, { method: "DELETE" })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        load();
      })
      .catch((err) => setError(err.message));
  };

  const toggleRole = (user) => {
    const newRole = user.role === "admin" ? "user" : "admin";
    fetch(`${BASE_URL}/users/${user._id}/role`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        load();
      })
      .catch((err) => setError(err.message));
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>User Management</h2>
      {error && <p style={styles.error}>Error: {error}</p>}
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Username</th>
            <th style={styles.th}>Role</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr
              key={u._id}
              style={{ cursor: "default" }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor)}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              <td style={styles.td}>{u.username}</td>
              <td style={styles.td}>{u.role}</td>
              <td style={styles.td}>
                <button
                  style={{ ...styles.button, ...styles.roleBtn }}
                  onClick={() => toggleRole(u)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.roleBtnHover.backgroundColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.roleBtn.backgroundColor)}
                >
                  Make {u.role === "admin" ? "User" : "Admin"}
                </button>
                <button
                  style={{ ...styles.button, ...styles.deleteBtn }}
                  onClick={() => handleDelete(u._id)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = styles.deleteBtnHover.backgroundColor)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = styles.deleteBtn.backgroundColor)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="3" style={{ textAlign: "center", padding: 20, color: "#777" }}>
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UserManagement;
