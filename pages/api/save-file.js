import { connectToDatabase } from "./utils/mongodb";
import { processTextFile, processWithTextract } from "./utils/processFiles";

export default async (req, res) => {
  const { id, files, email } = JSON.parse(req.body);
  const { db } = await connectToDatabase();

  const urls = files.map((f) => f.url);
  const newRecords = urls.map((url) => ({
    url,
    ready: false,
    data: null,
    email,
  }));

  // for each new file, write a new file entry
  const response = await db.collection("files").insertMany(newRecords);

  files.forEach(async ({ url, type }) => {
    // if the type includes "text/" process send to the text processor
    if (type.includes("text/")) {
      processTextFile(url, type);
      return;
    }

    // If we can analyze the text with AWS textract do that
    if (
      type === "application/pdf" ||
      type === "image/png" ||
      type === "image/jpeg"
    ) {
      processWithTextract(url);
      return;
    }

    // Something about MS docs
    // https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
    // if(type === "application/pdf" || type === "image/png" ||type === "image/jpeg"){
    //   processWithTextract(url);
    //   return
    // }
  });

  // maybe respond early with new id => link and then in callback keep processing?
  res.statusCode = 200;
  res.json({ success: true, files: Object.values(response.insertedIds) });
};
