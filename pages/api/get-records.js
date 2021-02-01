import { connectToDatabase } from "./utils/mongodb";

export default async function (req, res) {
  const { db } = await connectToDatabase();

  let results = await db.collection("files").find({ ready: true }).toArray();

  res.statusCode = 200;
  res.json(results);
}
