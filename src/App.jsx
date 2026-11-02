
import React, { useState } from "react";
import "./App.css";

// Header Component
const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="header">
      <div className="brand">
        <h2>🍽️ Grand Feast</h2>
        <span>Restaurant Management</span>
      </div>

      <div className="header-right">
        <span>Welcome, Admin</span>
        <button onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
        </button>
      </div>
    </header>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, color }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: color }}>
        {icon}
      </div>
      <div>
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </div>
  );
};

// Menu Component
const MenuList = ({ menu, onDelete }) => {
  return (
    <div className="panel">
      <h3>🍴 Restaurant Menu</h3>

      {menu.length === 0 ? (
        <p>No menu items available.</p>
      ) : (
        menu.map((item) => (
          <div className="menu-item" key={item.id}>
            <div>
              <strong>{item.name}</strong>
              <p>{item.category}</p>
            </div>

            <div className="menu-actions">
              <strong>₹{item.price}</strong>
              <button onClick={() => onDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Order Component
const OrderList = ({ orders, onUpdate }) => {
  return (
    <div className="panel">
      <h3>📦 Recent Orders</h3>

      {orders.length === 0 ? (
        <p>No orders available.</p>
      ) : (
        orders.map((order) => (
          <div className="order-item" key={order.id}>
            <div>
              <strong>{order.customer}</strong>
              <p>Order #{order.id} · ₹{order.amount}</p>
            </div>

            <div>
              <span className={`status ${order.status.toLowerCase()}`}>
                {order.status}
              </span>

              <button
                className="update-btn"
                onClick={() => onUpdate(order.id)}
                disabled={order.status === "Completed"}
              >
                Update
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

// Main Application
export default function App() {
  const [theme, setTheme] = useState("light");

  const [menu, setMenu] = useState([
    { id: 1, name: "Chicken Biryani", category: "Main Course", price: 220 },
    { id: 2, name: "Masala Dosa", category: "Breakfast", price: 90 },
    { id: 3, name: "Paneer Butter Masala", category: "Main Course", price: 180 },
    { id: 4, name: "Chocolate Brownie", category: "Dessert", price: 120 }
  ]);

  const [orders, setOrders] = useState([
    { id: 101, customer: "Rahul", amount: 450, status: "Pending" },
    { id: 102, customer: "Priya", amount: 320, status: "Preparing" },
    { id: 103, customer: "Arun", amount: 550, status: "Completed" }
  ]);

  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [itemCategory, setItemCategory] = useState("Main Course");

  const toggleTheme = () => {
    setTheme((prev) => prev === "light" ? "dark" : "light");
  };

  // Add Menu Item
  const addMenuItem = (e) => {
    e.preventDefault();

    if (!itemName.trim() || Number(itemPrice) <= 0) return;

    const newItem = {
      id: Date.now(),
      name: itemName.trim(),
      category: itemCategory,
      price: Number(itemPrice)
    };

    setMenu((prev) => [...prev, newItem]);
    setItemName("");
    setItemPrice("");
  };

  // Delete Menu Item
  const deleteMenuItem = (id) => {
    setMenu((prev) => prev.filter((item) => item.id !== id));
  };

  // Update Order Status
  const updateOrder = (id) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== id) return order;

        const nextStatus =
          order.status === "Pending"
            ? "Preparing"
            : order.status === "Preparing"
            ? "Completed"
            : "Completed";

        return { ...order, status: nextStatus };
      })
    );
  };

  const totalRevenue = orders
    .filter((order) => order.status === "Completed")
    .reduce((total, order) => total + order.amount, 0);

  return (
    <div className={`app-root ${theme}`}>

      <Header
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="dashboard">

        <div className="page-heading">
          <div>
            <h1>Restaurant Dashboard</h1>
            <p>Manage your restaurant activities in one place.</p>
          </div>
          <span className="open-label">● Restaurant Open</span>
        </div>

        {/* Statistics */}
        <section className="stats-grid">
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString("en-IN")}`}
            icon="💰"
            color="#fff0d9"
          />

          <StatCard
            title="Total Orders"
            value={orders.length}
            icon="🛍️"
            color="#e2edff"
          />

          <StatCard
            title="Menu Items"
            value={menu.length}
            icon="🍛"
            color="#e1f8e9"
          />

          <StatCard
            title="Customers"
            value="128"
            icon="👥"
            color="#f4e6ff"
          />
        </section>

        {/* Add Menu Form */}
        <section className="panel">
          <h3>➕ Add New Menu Item</h3>

          <form className="menu-form" onSubmit={addMenuItem}>
            <input
              type="text"
              placeholder="Food item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              required
            />

            <select
              value={itemCategory}
              onChange={(e) => setItemCategory(e.target.value)}
            >
              <option>Main Course</option>
              <option>Breakfast</option>
              <option>Dessert</option>
              <option>Drinks</option>
              <option>Starters</option>
            </select>

            <input
              type="number"
              placeholder="Price (₹)"
              min="1"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              required
            />

            <button type="submit">Add Item</button>
          </form>
        </section>

        {/* Menu and Orders */}
        <section className="content-grid">
          <MenuList
            menu={menu}
            onDelete={deleteMenuItem}
          />

          <OrderList
            orders={orders}
            onUpdate={updateOrder}
          />
        </section>

        <footer>
          © 2026 Grand Feast Restaurant | All Rights Reserved
        </footer>

      </main>
    </div>
  );
}
