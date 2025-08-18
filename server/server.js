import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import "./config/env.js";
import sequelize from "./config/db.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import regAndAuthRoutes from "./routes/authAndReg.routes.js";
import accountRoutes from "./routes/account.routes.js";
import dailyTaskRoutes from "./routes/dailyTask.routes.js";
import projectPlannerTeamRoutes from "./routes/projectPlannerTeam.routes.js";
import projectPlannerRoutes from "./routes/projectPlanner.routes.js";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import http from "http";
import "./models/associations.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  },
});
const PORT = process.env.PORT || 5000;
export { io };

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname)));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 5,
    },
  }),
);

app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Сервер работает!" });
});

app.use("/api", regAndAuthRoutes);
app.use("/api", accountRoutes);
app.use("/api", dailyTaskRoutes);
app.use("/api", projectPlannerRoutes);
app.use("/api", projectPlannerTeamRoutes);

io.on("connection", (socket) => {
  console.log("✅ Пользователь подключился:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Пользователь отключился:", socket.id);
  });
});

sequelize.sync({ alter: true }).then(() => {
  server.listen(PORT, () => console.log("Server started on port " + PORT));
  console.log("Database synchronized");
});
