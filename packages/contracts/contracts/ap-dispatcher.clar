
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
        ;; This is going to be executed through the dispatcher process
        ;; the contract itself is asset-less so even executing potentially
        ;; malicious AP contracts should be safe
        (as-contract (contract-call? ap execute OWNER))
    ))

;; read only functions
;;

;; private functions
;;

