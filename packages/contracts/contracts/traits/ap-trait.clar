(define-trait ap-trait (
    (execute (principal) (response bool {
        code: uint,
        source: principal,
        message: (string-ascii 256)
    }))

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