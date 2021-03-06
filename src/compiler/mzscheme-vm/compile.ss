#lang scheme/base

(require scheme/contract
         "mzscheme-vm.ss"
         "collections-module-resolver.ss"
         "../pinfo.ss"
         (only-in "../helpers.ss" program?)
         "../modules.ss"
         "../../compile-helpers.ss"
         "../../../js-runtime/src/bytecode-compiler.ss"
         "../../../js-runtime/src/sexp.ss"
         "../../../js-runtime/src/jsexp.ss")


(define default-base-pinfo (pinfo-update-module-resolver
                            (pinfo-update-allow-redefinition? 
                             (get-base-pinfo 'moby) #f)
                            (extend-module-resolver-with-collections
                             default-module-resolver)))

;; compile: input-port output-port name string -> pinfo
(define (compile/port in out
                      #:name name
                      #:pinfo (pinfo default-base-pinfo)
                      #:runtime-version [runtime-version #f])
  (let ([stxs (read-syntaxes in #:name name)])
    (compile/program stxs out
                     #:name name
                     #:pinfo pinfo
                     #:runtime-version runtime-version)))



;; compile/program: program output-port name string -> pinfo
(define (compile/program a-program out 
                         #:name name 
                         #:pinfo (a-pinfo default-base-pinfo)
                         #:runtime-version [runtime-version #f])
  (let*-values ([(a-compilation-top a-pinfo)
                 (compile-compilation-top a-program 
                                          a-pinfo
                                          #:name name)]
                [(a-jsexp)
                 (cond [runtime-version
                        (make-cmt (format "runtime-version: ~a" runtime-version)
                                  (compile-top a-compilation-top))]
                       [else
                        (compile-top a-compilation-top)])])
    (display (jsexp->js a-jsexp)
             out)
  a-pinfo))
  


;; port-name: port -> string
(define (port-name a-port)
  (format "~s" (object-name a-port)))



(provide/contract 
 [default-base-pinfo pinfo?]
 [compile/port ((input-port? output-port? #:name symbol?) (#:runtime-version string? #:pinfo pinfo?) . ->* . any)]
 [compile/program ((program? output-port? #:name symbol?) (#:runtime-version string? #:pinfo pinfo?) . ->* . any)])