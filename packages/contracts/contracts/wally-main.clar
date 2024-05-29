
;; title: wally-main
;; version:
;; summary:
;; description:

;; traits
;;

;; token definitions
;;

;; constants
;;
(define-constant ERR-UNAUTHORIZED (err u401))

;; data vars
;;
(define-data-var owner principal tx-sender)
;; data maps
;;
(define-map extensions principal bool)
;; public functions
;;

(define-public (set-extension (extension principal) (enabled bool)) 
    (begin 
        (try! (is-owner))
        (print {event: "extension", extension: extension, enabled: enabled})
        ;; don't see an issue leaving the extension unchecked other than user error
        ;; this might be avoided by checking that the owner deployed the extension
        ;; but that would conflict with transferring ownership
        ;; one solution to this is to disable ownership transfer and 
        ;; figure out a different migration strategy but that's a bit more complicated
        ;; #[allow(unchecked_data)]
        (map-set extensions extension enabled)
        (ok true)
    ))

(define-private (set-extensions-iter (item {extension: principal, enabled: bool}))
	(begin
		(print {event: "extension", extension: (get extension item), enabled: (get enabled item)})
		(map-set extensions (get extension item) (get enabled item))
	)
)

(define-public (set-extensions (extension-list (list 200 {extension: principal, enabled: bool})))
	(begin
		(try! (is-owner))
		(ok (map set-extensions-iter extension-list))
	)
)
;; read only functions
;;

(define-read-only (is-extension (extension principal)) 
    (default-to false (map-get? extensions extension)))


;; private functions
;;

(define-read-only (get-owner) 
    (var-get owner))

;; I chose contract-caller instead of tx-sender to enforce a rule that this contract
;; must be called directly by the owner when updating extensions.
(define-private (is-owner) 
    (ok (asserts! (is-eq (get-owner) contract-caller) ERR-UNAUTHORIZED)))
