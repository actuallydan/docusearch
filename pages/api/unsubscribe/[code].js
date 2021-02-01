import { connectToDatabase } from "../utils/mongodb";
import { toBinary } from "../utils/atob";

export default async function (req, res) {
  try {
    const { db } = await connectToDatabase();
    const { code } = req.query;

    let email = toBinary(code);

    await db.collection("subscribers").deleteOne({ email });
    await db.collection("files").deleteMany({ email });

    res.statusCode = 200;
    res.send("You have been removed from this mailing list");
  } catch (e) {
    res.statusCode = 400;
    res.send(
      "Hmmm... something went wrong while unsubscribing. Reach out to us at https://github.com/actuallydan/docusearch/issues"
    );
  }
}
