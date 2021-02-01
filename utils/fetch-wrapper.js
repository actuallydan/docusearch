export function fretch(url, body = null, options = { headers: {} }) {
  return fetch(url, {
    method: body ? "POST" : "GET",
    body: body ? JSON.stringify({ ...body }) : null,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }).then((res) => res.json());
}

export function postImage(url, file) {
  return fetch(url, {
    method: "POST",
    body: file,
    headers: {
      // "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  }).then((res) => res.json());
}
