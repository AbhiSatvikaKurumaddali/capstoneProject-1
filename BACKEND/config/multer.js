
‎memoryStorage‎
No definitions or references found
Skip to content
rajeshThappeta
anurag-blog-app-backend-b2
Repository navigation
Code
Issues
Pull requests
Agents
Actions
Projects
anurag-blog-app-backend-b2/config
/multer.js
rajeshThappeta
rajeshThappeta
backend of blogapp with file uplod feature
c0484f6
 · 
3 weeks ago
20 lines (19 loc) · 485 Bytes

Code

Blame
import multer from "multer";

export const upload = multer({
  //store in RAM
  storage: multer.memoryStorage(),
  //to avoid RAM overflow
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
  //for security validation
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
      cb(null, true);
    } else {
      const err = new Error("Only JPG and PNG allowed");
      err.status = 400;
      cb(err, false);
    }
  },
});
