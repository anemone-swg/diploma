import express from "express";
import session from "express-session";
import cors from "cors";
import path from "path";
import sequelize from "./db.js";
import bodyParser from "body-parser";
import regAndAuthRoutes from "./controllers/routeAuthAndReg.js";
import accountRoutes from "./controllers/routeAccount.js";
import dailyTaskRoutes from "./controllers/routeDailyTask.js";
import projectPlannerTeamRoutes from "./controllers/routeProjectPlannerTeam.js";
import projectPlannerRoutes from "./controllers/routeProjectPlanner.js";
import { fileURLToPath } from "url";
import { Server } from "socket.io";
import http from "http";
import "./models/Associations.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

const PORT = 5000;

export { io };

sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/uploads", express.static(path.join(__dirname)));

app.use(
  session({
    secret: "secret_key",
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
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.json({ message: "Сервер работает!" });
});

app.use(regAndAuthRoutes);
app.use(accountRoutes);
app.use(dailyTaskRoutes);
app.use(projectPlannerRoutes);
app.use(projectPlannerTeamRoutes);

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
