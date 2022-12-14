import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../backendLibs/dbLib";
import { v4 as uuidv4, v4 } from "uuid";
import { checkToken } from "../../../../backendLibs/checkToken";

export default function roomIdMessageRoute(req, res) {
  if (req.method === "GET") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }

    //get roomId from url
    const roomId = req.query.roomId;

    const rooms = readChatRoomsDB();

    //check if roomId exist
    const checkroom = rooms.find((x) => {
      return x.roomId === roomId;
    });
    if (!checkroom) {
      return res.status(404).json({
        ok: false,
        message: "Invalid roomId",
      });
    }

    return res.status(200).json({
      ok: true,
      messages: checkroom.messages,
    });
    //find room and return
    //...
  } else if (req.method === "POST") {
    //check token
    const user = checkToken(req);
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Yon don't permission to access this api",
      });
    }
    //get roomId from url
    const roomId = req.query.roomId;
    const rooms = readChatRoomsDB();

    //check if roomId exist
    const checkroom = rooms.find((x) => {
      return x.roomId === roomId;
    });
    if (!checkroom) {
      return res.status(404).json({
        ok: false,
        message: "Invalid room id",
      });
    }
    //validate body
    if (typeof req.body.text !== "string" || req.body.text.length === 0)
      return res.status(400).json({ ok: false, message: "Invalid text input" });

    //create message
    const newData = {
      messageId: v4(),
      text: req.body.text,
      username: user.username,
    };

    checkroom.messages.push(newData);

    writeChatRoomsDB(rooms);
    return res.status(200).json({
      ok: true,
      message: newData,
    });
  }
}
