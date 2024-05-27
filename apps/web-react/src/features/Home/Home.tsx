import { useConnect } from "@stacks/connect-react";
import { useCallback } from "react";
import { userSession } from "../../stacks/auth";
import Balances from "./components/Balances";

export default function Home() {
  const { doOpenAuth } = useConnect();
  const isSignedIn = userSession.isUserSignedIn();
  const userAddress =
    isSignedIn && userSession.loadUserData().profile.stxAddress.testnet;

  const openLogin = useCallback(() => {
    doOpenAuth(true);
  }, [doOpenAuth]);
  return (
    <div>
      <h1>Home</h1>
      {<button onClick={openLogin}>Select wallet</button>}
      {isSignedIn && <p>Hello {userAddress}</p>}
      <Balances address={userAddress} />
    </div>
  );
}
