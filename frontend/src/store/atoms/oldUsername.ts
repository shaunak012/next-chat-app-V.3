import { atom } from "recoil";

export const oldUsernameState = atom({
  key: "oldUsernameState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
