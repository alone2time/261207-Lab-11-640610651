import { checkToken } from "../../../../../backendLibs/checkToken";
import {
  readChatRoomsDB,
  writeChatRoomsDB,
} from "../../../../../backendLibs/dbLib";

export default function roomIdMessageIdRoute(req, res) {
  //get ids from url
  const roomId = req.query.roomId;
  const messageId = req.query.messageId;

  //check token
  const user = checkToken(req);
  if (!user) {
    return res.status(401).json({
      ok: false,
      message: "Yon don't permission to access this api",
    });
  }

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
  //check if messageId exist
  const check_m = checkroom.messages.find((x) => {
    return x.messageId === messageId;
  });
  if (!check_m) {
    return res.status(404).json({
      ok: false,
      message: "Invalid message id",
    });
  }
  //check if token owner is admin, they can delete any message
  if (user.isAdmin === false && user.username !== check_m.username) {
    return res.status(403).json({
      ok: false,
      message: "You do not have permisson to access this data",
    });
  }

  if (user.isAdmin === true) {
    const newM = checkroom.messages.filter((x) => messageId !== x.messageId);

    checkroom.messages = newM;
    writeChatRoomsDB(rooms);

    return res.status(200).json({
      ok: true,
    });
  }
  //or if token owner is normal user, they can only delete their own message!
  if (user.username === check_m.username) {
    const newM = checkroom.messages.filter((x) => messageId !== x.messageId);
    checkroom.messages = newM;
    writeChatRoomsDB(rooms);

    return res.status(200).json({
      ok: true,
    });
  }
}
