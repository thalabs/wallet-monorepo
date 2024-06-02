
;; title: scw-ap
;; version:
;; summary:
;; description:

;; traits
;;
(impl-trait .ap-trait.ap-trait)
;; token definitions
;;


;; constants
;;
(define-constant DAY u144)
(define-constant CADENCE DAY)
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-COOLDOWN (err u402))
(define-constant ERR-ALREADY-EXISTS (err u409))
(define-constant ERR-AP-EXPIRED (err u408))
(define-constant ERR-MAX-EXCEEDED (err u429))
(define-constant ERR-NOT-FOUND (err u404))

(define-constant DEPLOYER tx-sender)
;; data vars
;;
(define-data-var last-executed-at uint u0)
(define-data-var expires-at (optional uint) (some (+ burn-block-height (* u7 DAY))))
;; data maps
;;

;; public functions
;;
(define-public (update-expiry (new-expiry (optional uint)))
    (begin 
        (asserts! (is-eq tx-sender DEPLOYER) ERR-UNAUTHORIZED)
        ;; FIXME: not sure if we should check for ranges here.
        (var-set expires-at new-expiry)
        (ok true)))

(define-public (execute (fee-recipient principal))
    (begin
        (asserts! (or
            (is-eq tx-sender DEPLOYER)
            (unwrap-panic (contract-call? .dispatcher-registry is-dispatcher tx-sender))
        ) ERR-UNAUTHORIZED)
        (asserts! (or 
            (>= burn-block-height (+ (var-get last-executed-at) CADENCE))
            (is-eq u0 (var-get last-executed-at))
        ) ERR-COOLDOWN)
        (asserts! (or (is-none (var-get expires-at)) (< burn-block-height (unwrap-panic (var-get expires-at)))) ERR-AP-EXPIRED)
        (try! (contract-call? .scw-sip-010 transfer 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx (* u10 u1000 u1000) .scw-sip-010 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC none))
        (try! (contract-call? .scw-sip-010 transfer 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx (* u500 u1000) .scw-sip-010 fee-recipient none))
        (var-set last-executed-at burn-block-height)
        (ok true)))
;; read only functions
;;
(define-read-only (get-ap-meta)
    (ok {
            cadence: CADENCE,
            expires-at: (var-get expires-at),
        })
)

;; private functions
;;

