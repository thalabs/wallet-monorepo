(define-trait ap-trait (
    (execute (principal) (response bool uint))

    (get-ap-meta () 
        (response {
                cadence: uint,
                expires-at: (optional uint),
                dispatcher-whitelist: (list 100 principal)
            }
            uint))
))