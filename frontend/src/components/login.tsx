import { FormEvent, useState } from "react";
import styles from "@/styles/login.module.css";

const Login = (props: { setusername: (username: string) => void ,setoldusername: (username: string) => void }) => {
  const [user, setuser] = useState("");
  const [olduser, setolduser] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.setusername(user); //instead of doing this do a server call then make a db call from server to make sure name is unique
  };
  const submit2 = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    props.setoldusername(olduser); //instead of doing this do a server call then make a db call from server to make sure name is unique
  };

  return (
    <>
      <div id={styles.login_background}>
        <div className={styles.login_box}>
          <h2>Login</h2>
          <form onSubmit={(e) => submit(e)}>
            <div className={styles.user_box}>
              <input
                type="text"
                name=""
                required={true}
                onChange={(e) => setuser(e.target.value)}
                //
                maxLength={22}
                // minLength={7}
                //get it 22/7 is pi(3.14)
              />
              <label>Username&#40; new &#41;</label>
            </div>
            <button className={styles.custom_btn} type="submit">
              Submit
            </button>
          </form>
          <br></br>
          <form onSubmit={(e) => submit2(e)}>
            <div className={styles.user_box}>
              <input
                type="text"
                name=""
                required={true}
                onChange={(e) => setolduser(e.target.value)}
                //
                // maxLength={27}
                // minLength={12}
                //get it 22/7 is pi(3.14)
              />
              <label>Username&#40; old &#41;</label>
            </div>
            <button className={styles.custom_btn} type="submit">
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};
export default Login;
