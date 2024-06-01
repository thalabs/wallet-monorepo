
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
;; data vars
;;

;; data maps
;;

;; public functions
;;
(define-public (dispatch (ap <ap-trait>)) 
    (begin 
        (asserts! (is-eq tx-sender OWNER) ERR-UNAUTHORIZED)
        (ok true)
    ))

;; read only functions
;;

;; private functions
;;

