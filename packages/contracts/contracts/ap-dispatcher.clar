
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
(define-constant ERR-FAILED (err u400))
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
        (match (as-contract (contract-call? ap execute OWNER))
            ok-value 
            (handle-success ap)
            err-value
            (handle-failure ap err-value)
        )
    ))

;; read only functions
;;

;; private functions
;;


;; AP happens at midnight

(define-private (handle-success (ap <ap-trait>)) 
    (begin
        (print {event: "dispatch-successful", payload: {
            ap: (contract-of ap)
        }})
        (ok true)))

(define-private (handle-failure (ap <ap-trait>) (err-code uint)) 
    (begin 
        (print {event: "dispatch-failed", payload: {
            ap: (contract-of ap),
            result: err-code
        }})
    ERR-FAILED))