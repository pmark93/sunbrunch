let orders = [];

export default function handler(req, res) {
  if (req.method === "POST") {
    const { name, items } = req.body;
    if (!name || !items || !items.length) {
      return res.status(400).json({ message: "Invalid order data" });
    }
    orders.push({ id: orders.length + 1, name, items });
    return res.status(201).json({ message: "Order received" });
  }
  res.setHeader("Allow", ["POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
