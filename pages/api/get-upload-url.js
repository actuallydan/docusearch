const { createPresignedPost } = require("./utils/createPresignedPost");

export default async (req, res) => {
  try {
    const { name, type, size } = JSON.parse(req.body);

    if (size > 1000000) {
      res.statusCode = 400;
      res.json({ error: "File cannot be larger than 1 MB for demo" });
      return;
    }

    if (!/\/pdf|\/jpeg|\/png|text/.test(type)) {
      res.statusCode = 400;
      res.json({ error: "Not a supported file type at this time" });
      return;
    }

    const presignedPostData = await createPresignedPost({
      key: name,
      type,
    });

    res.statusCode = 200;
    res.json({ success: true, postURL: presignedPostData });
  } catch (e) {
    console.error(e);
    res.statusCode = 400;
    res.json({ error: e.message });
  }
};
