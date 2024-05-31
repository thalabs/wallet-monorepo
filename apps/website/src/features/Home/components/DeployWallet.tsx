import { useConnect } from "@stacks/connect-react";
import { useCallback } from "react";
import { contractPrincipalCV, trueCV } from "@stacks/transactions";
import { network } from "../../../services/stacks-apis";
import { userSession } from "../../../stacks/auth";

const walletCode = `
;; title: wally-main
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;;

;; constants
;;
(define-constant ERR-UNAUTHORIZED (err u401))

;; data vars
;;
(define-data-var owner principal tx-sender)
;; data maps
;;
(define-map extensions principal bool)
;; public functions
;;

(define-public (set-extension (extension principal) (enabled bool)) 
    (begin 
        (try! (is-owner))
        (print {event: "extension", extension: extension, enabled: enabled})
        ;; don't see an issue leaving the extension unchecked other than user error
        ;; this might be avoided by checking that the owner deployed the extension
        ;; but that would conflict with transferring ownership
        ;; one solution to this is to disable ownership transfer and 
        ;; figure out a different migration strategy but that's a bit more complicated
        ;; #[allow(unchecked_data)]
        (map-set extensions extension enabled)
        (ok true)
    ))

(define-private (set-extensions-iter (item {extension: principal, enabled: bool}))
	(begin
		(print {event: "extension", extension: (get extension item), enabled: (get enabled item)})
		(map-set extensions (get extension item) (get enabled item))
	)
)

(define-public (set-extensions (extension-list (list 200 {extension: principal, enabled: bool})))
	(begin
		(try! (is-owner))
		(ok (map set-extensions-iter extension-list))
	)
)
;; read only functions
;;

(define-read-only (is-extension (extension principal)) 
    (default-to false (map-get? extensions extension)))


;; private functions
;;

(define-read-only (get-owner) 
    (var-get owner))

;; I chose contract-caller instead of tx-sender to enforce a rule that this contract
;; must be called directly by the owner when updating extensions.
(define-private (is-owner) 
    (ok (asserts! (is-eq (get-owner) contract-caller) ERR-UNAUTHORIZED)))
`;

const sip010ExtCode = `
;; title: sip-010-ext
;; version:
;; summary:
;; description:

;; traits
;;
(use-trait sip-010 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sip-010-trait-ft-standard.sip-010-trait)

;; token definitions
;;

;; constants
;;
(define-constant CONTRACT (as-contract tx-sender))

(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-BAD-ARG (err u400))
(define-constant ERR-TOKEN-NOT-ALLOWED (err u402))

;; data vars
;;

;; data maps
;;
(define-map token-wl principal bool)
;; public functions
;;
(define-public (transfer (token-id <sip-010>) (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
    (begin 
        (asserts! (is-enabled) ERR-UNAUTHORIZED)
        (asserts! (is-eq CONTRACT sender) ERR-BAD-ARG)
        (try! (is-owner-or-extension))
        (asserts! (is-token-enabled (contract-of token-id)) ERR-TOKEN-NOT-ALLOWED)
        (as-contract (contract-call? token-id transfer amount tx-sender recipient memo))))

(define-public (set-token-wl (token-id principal) (state bool)) 
    (begin 
        (asserts! (is-owner) ERR-UNAUTHORIZED)
        ;; FIXME: not sure if a check is needed here don't think so tbh
        (map-set token-wl token-id state)
        (ok true)
    ))


(define-public (is-owner-or-extension)
	(ok 
        (asserts! 
            (or 
                (is-owner)
                (contract-call? .wally-main is-extension contract-caller)) 
            ERR-UNAUTHORIZED)))
;; read only functions
;;
(define-read-only (get-token-wl (token-id principal))
    ;; #[allow(unchecked_data)]
    (ok (is-token-enabled token-id)))

;; private functions
;;

(define-private (is-owner) 
    (is-eq (contract-call? .wally-main get-owner) contract-caller))

(define-private (is-enabled) 
    (contract-call? .wally-main is-extension (as-contract tx-sender)))

(define-private (is-token-enabled (token-id principal))
    (default-to false (map-get? token-wl token-id)))`;

interface UserData {
  profile: {
    stxAddress: {
      testnet: string;
    };
  };
}
export function DeployWallet(): JSX.Element {
  const { doContractCall, doContractDeploy } = useConnect();
  const userAddress: string = (userSession.loadUserData() as UserData).profile
    .stxAddress.testnet;
  const deploy = useCallback(async () => {
    await doContractDeploy({
      codeBody: walletCode,
      contractName: "wally-main",
      network,
    });

    await doContractDeploy({
      codeBody: sip010ExtCode,
      contractName: "scw-sip-010",
      network,
    });
  }, [doContractDeploy]);

  const enableSip010 = useCallback(async () => {
    await doContractCall({
      contractAddress: userAddress,
      contractName: "wally-main",
      functionArgs: [contractPrincipalCV(userAddress, "scw-sip-010"), trueCV()],
      functionName: "set-extension",
      network,
    });
  }, [doContractCall, userAddress]);

  const enableWSTX = useCallback(async () => {
    await doContractCall({
      contractAddress: userAddress,
      contractName: "scw-sip-010",
      functionArgs: [
        contractPrincipalCV(
          "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM",
          "wstx",
        ),
        trueCV(),
      ],
      functionName: "set-token-wl",
      network,
    });
  }, [doContractCall, userAddress]);
  return (
    <div>
      <h2>Deploy Wallet</h2>
      <button type="button" onClick={deploy}>
        Deploy
      </button>

      <h2>Enable Sip-010 Extension</h2>
      <button type="button" onClick={enableSip010}>
        Enable
      </button>

      <h2>Enable WSTX Token</h2>
      <button type="button" onClick={enableWSTX}>
        Enable
      </button>
    </div>
  );
}
