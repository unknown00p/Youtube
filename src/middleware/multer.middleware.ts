// import multer from "multer";
// import fs from "fs";
// import path from "path";
// import crypto from "crypto";

// const uploadDir = path.join(process.cwd(), "uploads");

// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir, { recursive: true });
// }

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, uploadDir);
//   },

//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname);
//     const uniqueName = crypto.randomUUID();
//     cb(null, `${uniqueName}${ext}`);
//   },
// });

// export const upload = multer({ storage: storage });