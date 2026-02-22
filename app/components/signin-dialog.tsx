"use client";
import { useActionState, useRef, useEffect } from "react";
import { signInWithOtp } from "../actions/auth";

export const SignInDialog = () => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  // Initialize state to match your ApiResponse structure
  const [state, formAction, isPending] = useActionState(signInWithOtp, {
    success: false,
    error: null,
    data: null,
  } as any);

  const isOtpStep = state.data?.emailSent;

  useEffect(() => {
    if (state.success && !isOtpStep) {
      // This triggers only after the final verification success
      dialogRef.current?.close();
    }
  }, [state.success, isOtpStep]);

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => dialogRef.current?.showModal()}
      >
        Sign In
      </button>

      <dialog ref={dialogRef} className="modal">
        <div className="modal-box w-full max-w-sm">
          <h3 className="font-bold text-xl mb-6">
            {isOtpStep ? "Verify Identity" : "Welcome Back"}
          </h3>

          <form action={formAction} className="space-y-5">
            {!isOtpStep ? (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="input input-bordered w-full"
                />
              </div>
            ) : (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text">Enter 6-digit Code</span>
                </label>
                <input
                  type="text"
                  name="otp"
                  required
                  maxLength={8}
                  placeholder="00000000"
                  className="input input-bordered w-full text-center text-2xl tracking-widest"
                  autoFocus
                />
                {/* Keep the email in the form state */}
                <input type="hidden" name="email" value={state.data?.email} />
                <p className="text-xs mt-2 opacity-70">
                  Code sent to <strong>{state.data?.email}</strong>
                </p>
              </div>
            )}

            {/* Error handling */}
            {state.error && (
              <p className="text-sm text-error bg-error/10 p-2 rounded">
                {state.error}
              </p>
            )}

            {/* Success feedback (optional, e.g. "Code sent") */}
            {state.message && !state.error && (
              <p className="text-sm text-success">{state.message}</p>
            )}

            <div className="modal-action">
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => dialogRef.current?.close()}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="btn btn-primary"
                disabled={isPending}
              >
                {isPending && (
                  <span className="loading loading-spinner loading-xs"></span>
                )}
                {isOtpStep ? "Verify Code" : "Send OTP"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};
