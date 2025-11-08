import React, { useState, useEffect } from "react";

const menuData = {
  Soup: ["Sütőtökkrém leves"],
  Mains: [
    "Beans on toast (avagy paradicsomos bab pirítóssal, tükörtojással)",
    "Paradicsomos-olajbogyós frittata",
    "Vegetáriánus quesadilla",
  ],
  Dessert: ["Gofri feltételesen (lekvár, nutella)"],
};

function MenuSection({ title, items, selectedItems, toggleItem }) {
  return (
    <section className="menu-section">
      <h2>{title}</h2>
      <ul>
        {items.map((item) => (
          <li key={item}>
            <label>
              <input
                type="checkbox"
                checked={selectedItems.includes(item)}
                onChange={() => toggleItem(item)}
              />{" "}
              {item}
            </label>
          </li>
        ))}
      </ul>
    </section>
  );
}

function OrderForm() {
  const [name, setName] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);

  const toggleItem = (item) => {
    setSelectedItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const submitOrder = async () => {
    if (!name.trim() || selectedItems.length === 0) {
      alert("Please enter your name and select at least one item.");
      return;
    }

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, items: selectedItems }),
      });

      if (response.ok) {
        alert("Order submitted!");
        setName("");
        setSelectedItems([]);
      } else {
        alert("Failed to submit order.");
      }
    } catch (err) {
      alert("Failed to submit order.");
    }
  };

  return (
    <div className="order-form">
      <h2>Place Your Order</h2>
      <input
        type="text"
        placeholder="Your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      {Object.entries(menuData).map(([category, items]) => (
        <MenuSection
          key={category}
          title={category}
          items={items}
          selectedItems={selectedItems}
          toggleItem={toggleItem}
        />
      ))}
      <button onClick={submitOrder}>Order</button>
    </div>
  );
}

function AdminPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await fetch("/api/orders");
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
      }
    }
    fetchOrders();
    // poll every 5 sec
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-page">
      <h2>Orders Received</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {orders.map(({ id, name, items }) => (
            <li key={id}>
              <strong>{name}</strong>: {items.join(", ")}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function App() {
  const [adminMode, setAdminMode] = useState(false);

  return (
    <div className="app-container">
      <header>
        <h1>Brunch Menu & Orders</h1>
        <button onClick={() => setAdminMode(!adminMode)}>
          {adminMode ? "Show Menu" : "Show Admin"}
        </button>
      </header>
      <main>{adminMode ? <AdminPage /> : <OrderForm />}</main>
    </div>
  );
}
