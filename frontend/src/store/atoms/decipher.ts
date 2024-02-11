import { atom } from "recoil";

export const decipher_State = atom({
  key: "decipher_State", // unique ID (with respect to other atoms/selectors)
  default: undefined as any // default value (aka initial value)
});
