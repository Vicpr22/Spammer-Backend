import express from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

app.get("/messages", async (req, res) => {
  try {
    const messages = await prisma.message.findMany();

    res.send({ success: true, messages });
  } catch (error) {
    res.send({ success: false, error: "Error fetching messages." });
  }
});

app.post("/messages", async (req, res) => {
  const { text } = req.body;

  try {
    const message = await prisma.message.create({ data: { text } });

    res.send({
      success: true,
      message,
    });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

app.put("/messages/:messageId", async (req, res) => {
  const messageId = req.params.messageId;
  const { text } = req.body;

  try {
    const message = await prisma.message.update({
      where: { id: messageId },
      data: {
        text,
      },
    });

    res.send({
      success: true,
      message,
    });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

app.delete("/messages/:messageId", async (req, res) => {
  //const messageId = parseInt(req.params.id);
  //console.log(typeof messageId);
  const { messageId } = req.params;

  try {
    const message = await prisma.message.delete({
      where: { id: messageId },
    });

    res.send({
      success: true,
      message,
    });
  } catch (error) {
    res.send({ success: false, error: error.message });
  }
});

app.get("/", (req, res) => {
  res.send({ success: true, message: "Welcome to the Spammer Server" });
});

//Handle generic errors
app.use((req, res) => {
  res.send({ success: false, error: "No route found." });
});

app.use((error, req, res, next) => {
  res.send({ success: false, error: error.message });
});

//sets up which port we are using
const port = 3000;

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
