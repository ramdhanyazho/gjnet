export default function handler(req, res) {
  res.status(200).json([
    { id: 1, customerId: 1, amount: 50000 },
    { id: 2, customerId: 2, amount: 75000 }
  ]);
}
