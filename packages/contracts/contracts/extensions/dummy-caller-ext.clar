
;; title: dummy-caller-ext
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;;

;; constants
;;

;; data vars
;;

;; data maps
;;

;; public functions
;;
(define-public (test-sip-010) 
    (as-contract (contract-call? .scw-sip-010 transfer 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ.wstx u10 .scw-sip-010 'SP32AEEF6WW5Y0NMJ1S8SBSZDAY8R5J32NBZFPKKZ none)))

(define-public (test-set-extension) 
    (begin 
        (try! (contract-call? .wally-main set-extension (as-contract tx-sender) true))
        (as-contract (contract-call? .wally-main set-extension (as-contract tx-sender) true))))
;; read only functions
;;

;; private functions
;;

