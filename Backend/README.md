BlogApp Backend
backend for a blog application with role‑based access (User, Author, Admin). It includes authentication, article management, and secure APIs.

---

Features
- User authentication with **JWT**
- Password hashing using **bcryptjs**
- Role‑based APIs (Admin, Author, User, Common)
- MongoDB integration with **Mongoose**
- CORS enabled for frontend integration
- Cookie parsing for session handling
- Environment variable management with **dotenv**

---

 Installation Guide:
 npm install
- express
- mongoose
- cors
- dotenv
- jsonwebtoken
- bcryptjs
- cookie-parser



blogapp-Backend
│── API/
│   ├── adminAPI.js
│   ├── authorAPI.js
│   ├── commonAPI.js
│   └── userAPI.js
│── middleware/
│   └── verifyToken.js
│── models/
│   ├── articleModel.js
│   └── userModel.js
│── utils/
│   └── db.js
│── server.js
│── .env
│── adminrequest.http
│── authorrequest.http
│── userrequest.http

Running the Server:
npm run dev

