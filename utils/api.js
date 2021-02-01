export default {
  uploadToAWS: (signedLink, file) => {
    return new Promise((resolve) => {
      const xhr = new XMLHttpRequest();
      xhr.open("PUT", signedLink);
      xhr.setRequestHeader("Content-Type", file.type + "; charset=utf-8");
      xhr.setRequestHeader("X-Amz-ACL", "public-read");

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            // resolve(xhr);
            resolve({
              url:
                "https://" +
                process.env.NEXT_PUBLIC_AWS_BUCKET +
                ".s3.us-east-2.amazonaws.com/" +
                file.name,
              type: file.type,
            });
          } else {
            throw "Could not upload file";
          }
        }
      };
      xhr.send(file);
    });
  },
  updateRecord: ({ email, id }) => {
    return fetch("/api/records/" + id, {
      body: JSON.stringify({
        email,
      }),
      method: "PUT",
    }).then((res) => res.json());
  },
};
