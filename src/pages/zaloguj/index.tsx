import { signIn } from "next-auth/react";
import { useRef, type FormEvent } from "react";

const LoginPage = () => {
  const usernameInput = useRef<HTMLInputElement>(null);
  const passwordInput = useRef<HTMLInputElement>(null);

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      username: usernameInput,
      password: passwordInput,
      redirect: false,
    });
    console.log(res);
  };

  return (
    <form onSubmit={(e) => void handleFormSubmit(e)}>
      <input type="text" placeholder="Nazwa uzytkownika" ref={usernameInput} />
      <input type="password" placeholder="Haslo" ref={passwordInput} />
      <button type="submit">Zaloguj</button>
    </form>
  );
};

export default LoginPage;
