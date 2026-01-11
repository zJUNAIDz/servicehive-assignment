import { app } from "./app";
import { PORT } from "./lib/constants";
import { connectDB } from "./models";
import { authRouter } from "./routes/auth";

connectDB();
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
