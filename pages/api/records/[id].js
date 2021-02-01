import { connectToDatabase } from "../utils/mongodb";
const ObjectID = require("mongodb").ObjectID;

export default async (req, res) => {
  if (req.method === "GET") {
    const { id } = req.query;

    try {
      const { db } = await connectToDatabase();

      let record = await db
        .collection("files")
        .findOne({ _id: new ObjectID(id) });

      res.statusCode = 200;
      res.json({ success: true, data: record });
    } catch (e) {
      res.statusCode = 400;
      res.json({ error: e.message });
    }
  } else if (req.method === "PUT") {
    const { id } = req.query;

    const { email } = JSON.parse(req.body);

    try {
      const { db } = await connectToDatabase();

      await db
        .collection("files")
        .updateOne({ _id: new ObjectID(id) }, { $set: { email } });

      res.statusCode = 200;
      res.json({ success: true });
    } catch (e) {
      res.statusCode = 400;
      res.json({ error: e.message });
    }
  }
};
