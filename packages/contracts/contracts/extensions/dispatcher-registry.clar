
;; title: dispatcher-registry
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;;

;; constants
;;
(define-constant ERR-UNAUTHORIZED (err {
    code: u401,
    source: (as-contract tx-sender),
    message: "Unauthorized"
}))

(define-constant DEPLOYER tx-sender)

;; data vars
;;

;; data maps
;; TODO: add event unix time when specfic dispatcher is added?
(define-map dispatchers principal bool)
(map-set dispatchers .ap-dispatcher true)
;; public functions
;;
(define-public (set-dispatcher (dispatcher principal) (enabled bool))
    (begin
        ;; TODO: q: should extensions have the ability to update enabled dispatchers?
        (asserts! (is-eq tx-sender DEPLOYER) ERR-UNAUTHORIZED)
        ;; FIXME: should there be a check here
        (map-set dispatchers dispatcher enabled)
        (ok true)))

;; read only functions
;;

(define-read-only (is-dispatcher (dispatcher principal)) 
    (ok (default-to false (map-get? dispatchers dispatcher))))
;; private functions
;;

