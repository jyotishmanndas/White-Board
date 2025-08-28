import express from "express";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import roomRoutes from "./routes/room.routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", userRoutes);
app.use("/room", roomRoutes);

app.listen(3001, () => {
    console.log('Server is listening on the port 3001');
}) 