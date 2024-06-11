(define-trait ap-trait (
    (execute (principal) (response bool uint))

    (get-ap-meta () 
        (response {
                ;; TODO: should we use unix timestamp (seconds) 
                ;; instead for more frequent operations and such?
                cadence: uint,
                ;; bitcoin block height at which the AP will expire (burn-block-height).
                expires-at: (optional uint),
            }
            uint))
))