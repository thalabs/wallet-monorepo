
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
;; TODO: think of changing dispatcher to be a contract?
;; I'm thinking for this cuz it would be much more flexible
;; where we can add more dispatchers, and use as-contract to execute
;; using as-contract would make the dispatcher easily assetless
(define-constant DEPLOYER tx-sender)
;; data vars
;;

;; data maps
;;

;; public functions
;;
(define-public (execute) 
    (ok true))
;; read only functions
;;
(define-read-only (get-ap-meta) 
    (ok {
            cadence: DAY,
            expires-at: (some (+ burn-block-height (* u7 DAY))),
            dispatcher-whitelist: (list .ap-dispatcher)
        })
)

;; private functions
;;

