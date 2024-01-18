import { useState, useCallback } from "react";

export default function useClientRect() {
  const [rect, setRect] = useState(0);
  const [test, settest] = useState(document.documentElement.clientWidth);
  setInterval(() => {
    settest(document.documentElement.clientWidth);
  }, 5000);
  //remove test above and below when not in develeopement and setinterval
  const ref = useCallback(
    (node: any) => {
      if (node !== null) {
        setRect(node.getBoundingClientRect().height);
        // console.log(rect);
      }
    },
    [test]
  );
  return [rect, ref];
}
  //got it from here https://legacy.reactjs.org/docs/hooks-faq.html#how-can-i-measure-a-dom-node
  //I made it responsive but in a stupid way lol  ☆*: .｡. o(≧▽≦)o .｡.:*☆
