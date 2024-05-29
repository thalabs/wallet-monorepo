
;; title: sip-010-ext
;; version:
;; summary:
;; description:

;; traits
;;
(use-trait sip-010 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

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
    (default-to false (map-get? token-wl token-id)))