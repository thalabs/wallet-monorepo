
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
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-ALREADY-EXISTS (err u409))
(define-constant ERR-MAX-EXCEEDED (err u429))
(define-constant ERR-NOT-FOUND (err u404))

(define-constant DEPLOYER tx-sender)
;; data vars
;;
(define-data-var dispatcher-whitelist (list 100 principal) (list .ap-dispatcher))
;; data maps
;;

;; public functions
;;

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

(define-public (execute)
    (let (
            (wl (var-get dispatcher-whitelist)))
        (asserts! (or 
            (is-eq tx-sender DEPLOYER)
            (is-some (index-of? wl tx-sender))
        ) ERR-UNAUTHORIZED)
        (ok true)))
;; read only functions
;;
(define-read-only (get-ap-meta)
    (ok {
            cadence: DAY,
            expires-at: (some (+ burn-block-height (* u7 DAY))),
            dispatcher-whitelist: (var-get dispatcher-whitelist),
        })
)

(define-read-only (get-dispatchers) 
    (ok (var-get dispatcher-whitelist)))

;; private functions
;;

