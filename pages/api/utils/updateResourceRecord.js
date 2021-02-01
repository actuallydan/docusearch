import { connectToDatabase } from "./mongodb";
import sendEmail from "./sendEmail";
import { toBase64 } from "./atob";
import htmlEmailString from "../../../templates/demo";

const sw = require("stopword");

export default async function updateResourceRecord(resource, data) {
  try {
    const { db } = await connectToDatabase();

    // remove words that have no meaning (it, a, the, etc.)
    data = sw.removeStopwords(data, [
      "//",
      "{",
      "}",
      "/",
      "+",
      "-",
      "let",
      "const",
      "var",
      "=",
      ":",
    ]);

    // remove duplicate words
    data = data.filter((item, index) => data.indexOf(item) === index);

    // update record corresponding to this file with finalized text analysis
    await db
      .collection("files")
      .updateOne({ url: resource }, { $set: { data, ready: true } });
    let res = await db.collection("files").findOne({ url: resource });

    // if the user subbed, grab their email and email them results
    if (res.email) {
      let code = toBase64(res.email);
      // get HTML template and inject data
      let html = htmlEmailString
        .replace("{{email}}", res.email)
        .replace("{{data}}", JSON.stringify(data))
        .replace("{{date}}", new Date().getFullYear())
        .replace(
          "{{unsublink}}",
          process.env.NODE_ENV === "production"
            ? "https://docusear.ch/api/unsubscribe/" + code
            : "http://localhost:3000/api/unsubscribe/" + code
        );

      sendEmail({
        from: "mailer@docusear.ch",
        to: res.email,
        html,
        subject: "Your Docusear.ch results are ready",
      });
    }
    return;
  } catch (e) {
    console.error(e);
  }
}
