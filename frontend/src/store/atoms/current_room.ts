import { message } from "@backend/types/socket_types";
import { atom } from "recoil";

export const currentRoomState = atom({
  key: "currentRoomState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
