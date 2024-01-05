import { message } from "@backend/types/socket_types";
import { atom } from "recoil";

export const messagesState = atom({
  key: "messagesState", // unique ID (with respect to other atoms/selectors)
  default: [] as message[], // default value (aka initial value)
});
