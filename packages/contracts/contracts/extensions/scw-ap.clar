
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
(define-constant DAY (to-uint (* 24 60 60)))
(define-constant CADENCE DAY)
(define-constant ERR-UNAUTHORIZED (err {
    code: u401,
    source: (as-contract tx-sender),
    message: "Unauthorized"
}))
(define-constant ERR-COOLDOWN (err {
    code: u402,
    source: (as-contract tx-sender),
    message: "Cooldown"
}))
(define-constant ERR-AP-EXPIRED (err {
    code: u408,
    source: (as-contract tx-sender),
    message: "AP expired"
}))


(define-constant DEPLOYER tx-sender)
;; data vars
;;

(define-data-var last-executed-at uint u0)
(define-data-var expires-at (optional uint) (some (+ (get-unix-time) (* u7 DAY))))
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
            (>= (get-unix-time) (+ (var-get last-executed-at) CADENCE))
            ;; FIXME: should we have a first execution?
            (is-eq u0 (var-get last-executed-at))
        ) ERR-COOLDOWN)
        (asserts! (or (is-none (var-get expires-at)) (< (get-unix-time) (unwrap-panic (var-get expires-at)))) ERR-AP-EXPIRED)
        (try! (contract-call? .scw-sip-010 transfer 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx (* u10 u1000 u1000) .scw-sip-010 'ST2JHG361ZXG51QTKY2NQCVBPPRRE2KZB1HR05NNC none))
        (try! (contract-call? .scw-sip-010 transfer 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx (* u500 u1000) .scw-sip-010 fee-recipient none))
        (var-set last-executed-at (get-unix-time))
        (ok true)))
;; read only functions
;;
(define-read-only (get-ap-meta)
    (ok {
            cadence: CADENCE,
            expires-at: (var-get expires-at),
        })
)

(define-read-only (get-unix-time) 
    (unwrap-panic (get-block-info? time (- block-height u1)))
)

;; private functions
;;

