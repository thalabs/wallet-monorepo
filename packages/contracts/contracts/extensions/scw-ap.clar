
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
(define-data-var dispatcher-whitelist (list 100 principal) (list .ap-dispatcher))
(define-data-var last-executed-at uint u0)
(define-data-var expires-at (optional uint) (some (+ burn-block-height (* u7 DAY))))
;; data maps
;;

;; public functions
;;
;; TODO: move dispatcher registry to different extension that feeds all aps?
(define-public (add-dispatcher (dispatcher principal))
    (let ((wl (var-get dispatcher-whitelist)))
        (asserts! (is-eq tx-sender DEPLOYER) ERR-UNAUTHORIZED)
        (asserts! (is-none (index-of? wl dispatcher)) ERR-ALREADY-EXISTS)
        (var-set dispatcher-whitelist (unwrap! (as-max-len? (append wl dispatcher) u100) ERR-MAX-EXCEEDED))
        (ok true)))

(define-public (remove-dispatcher (dispatcher principal)) 
    (begin
        (asserts! (is-eq tx-sender DEPLOYER) ERR-UNAUTHORIZED)
        (let (
                (wl (var-get dispatcher-whitelist))
                ;; #[filter(dispatcher)]
                (dispatcher-index (unwrap! (index-of? wl dispatcher) ERR-NOT-FOUND))
                (first-slice (default-to (list) (slice? wl u0 dispatcher-index)))
                (second-slice (default-to (list) (slice? wl (+ dispatcher-index u1) (len wl))))
            ) 
            (var-set dispatcher-whitelist 
                (unwrap! 
                    (as-max-len? (concat first-slice second-slice) u100) 
                ERR-MAX-EXCEEDED))
            (ok true))))

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
            (is-some (index-of? (var-get dispatcher-whitelist) tx-sender))
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
            dispatcher-whitelist: (var-get dispatcher-whitelist),
        })
)

(define-read-only (get-dispatchers) 
    (ok (var-get dispatcher-whitelist)))

;; private functions
;;

