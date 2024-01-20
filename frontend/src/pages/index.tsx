import { useState } from "react";
import Login from "@/components/login";
import MiniDrawer from "@/components/sidebar";
import {
  useRecoilState,
  useRecoilValue,
} from "recoil";
import { usernameState } from "@/store/atoms/username";
import { oldUsernameState } from "@/store/atoms/oldUsername";

const Index = () => {
  const [username, setusername] = useRecoilState(usernameState);
  const [oldusername, setoldusername] = useRecoilState(oldUsernameState);
    return (
      <>
        {username === ""&& oldusername === "" ? (
          <Login
            setusername={setusername}
            setoldusername={setoldusername}
          ></Login>
          ) : (
            <MiniDrawer username={username} oldusername={oldusername}></MiniDrawer>
          )}
      </>
    );
};
export default Index;


/*
****** THINGS OF NOTE DURING THE PROJECT ******
3.I had to figure out why the messages were displaying twice while develeopment (it was due to react strict mode)
4.I did not know how to host an app
1.As vercel does not host websockets i had to find another service to host my app
2.When i hosted my app the font color changed to white on other's browsers but worked fine on the browser i was developing my project.
5.I had to figure out how to create a right-click menu 
6."textOverflow":"ellipsis" it took me 2hrs to find this property
7. state is undefined even when i set it 


references:
1. https://stackoverflow.com/questions/65058598/nextjs-cors-issue
2. https://harkirat.classx.co.in/new-courses/2
3. https://blog.logrocket.com/using-cors-next-js-handle-cross-origin-requests/

*/