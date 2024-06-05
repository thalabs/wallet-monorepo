import { useConnect } from "@stacks/connect-react";
import { useCallback } from "react";
import { userSession } from "../stacks";
import {
  Balances,
  DeployWallet,
  FundWallet,
  TransferTokens,
} from "../components";

interface UserData {
  profile: {
    stxAddress: {
      testnet: string;
    };
  };
}
function Home(): JSX.Element {
  const { doOpenAuth } = useConnect();
  const isSignedIn = userSession.isUserSignedIn();
  const userAddress =
    isSignedIn &&
    (userSession.loadUserData() as UserData).profile.stxAddress.testnet;

  const openLogin = useCallback(() => {
    doOpenAuth(true);
  }, [doOpenAuth]);
  return (
    <div>
      <h1>Home</h1>
      <button type="button" onClick={openLogin}>
        Select wallet
      </button>
      {isSignedIn ? <p>Hello {userAddress}</p> : null}
      {userAddress ? (
        <>
          <Balances address={`${userAddress}.scw-sip-010`} />
          <DeployWallet />
          <FundWallet address={`${userAddress}.scw-sip-010`} />
          <TransferTokens address={`${userAddress}.scw-sip-010`} />
        </>
      ) : null}
    </div>
  );
}

export default Home;
