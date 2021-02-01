import { connectToDatabase } from "./utils/mongodb";

export default async (req, res) => {
  const { db } = await connectToDatabase();
  const { email } = JSON.parse(req.body);
  // validate email

  // check and see if email already exists
  const user = await db.collection("subscribers").findOne({ email: email });

  // write to db
  if (!user) {
    await db.collection("subscribers").insertOne({ email: email });
    // return success
    res.statusCode = 200;
    res.json({ success: true });
  } else {
    res.statusCode = 400;
    res.json({ error: { message: "Email already signed up" } });
  }
};
