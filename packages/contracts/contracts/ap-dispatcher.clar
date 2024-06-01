
;; title: ap-executor
;; version:
;; summary:
;; description:

;; traits
;;
(use-trait ap-trait .ap-trait.ap-trait)
;; token definitions
;;

;; constants
;;
(define-constant OWNER tx-sender)
(define-constant ERR-UNAUTHORIZED (err u401))
(define-constant ERR-NOT-WHITELISTED (err u4011))
;; data vars
;;

;; data maps
;;

;; public functions
;;
(define-public (dispatch (ap <ap-trait>)) 
    (begin 
        (asserts! (is-eq tx-sender OWNER) ERR-UNAUTHORIZED)
        (asserts! (is-some (index-of? 
            (get dispatcher-whitelist (unwrap-panic (contract-call? ap get-ap-meta)))
            (as-contract tx-sender)
        )) ERR-NOT-WHITELISTED)
        (ok true)
    ))

;; read only functions
;;

;; private functions
;;

