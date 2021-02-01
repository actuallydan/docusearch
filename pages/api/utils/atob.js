export const toBinary = (a) => Buffer.from(a, "base64").toString("binary");

export const toBase64 = (b) => Buffer.from(b).toString("base64");
