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
        className="coc-btn coc-btn-green"
        onClick={() => dialogRef.current?.showModal()}
      >
        Sign In
      </button>

      <dialog ref={dialogRef} className="modal coc-overlay">
        <div className="modal-box coc-panel bg-[#E6E1D6] p-8 max-w-sm w-full">
          <h3 className="font-luckiest text-2xl mb-6 text-[#4A3B2A] text-center uppercase drop-shadow-sm">
            {isOtpStep ? "Verify Identity" : "Welcome Chief"}
          </h3>

          <form action={formAction} className="space-y-5">
            {!isOtpStep ? (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-[#4A3B2A]">Email Address</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="chief@clash.com"
                  className="coc-input w-full"
                />
              </div>
            ) : (
              <div className="form-control w-full">
                <label className="label">
                  <span className="label-text font-bold text-[#4A3B2A]">Enter 6-digit Code</span>
                </label>
                <input
                  type="text"
                  name="otp"
                  required
                  maxLength={8}
                  placeholder="00000000"
                  className="coc-input w-full text-center text-2xl tracking-widest font-mono"
                  autoFocus
                />
                {/* Keep the email in the form state */}
                <input type="hidden" name="email" value={state.data?.email} />
                <p className="text-xs mt-2 text-[#5c4d3c]">
                  Code sent to <strong>{state.data?.email}</strong>
                </p>
              </div>
            )}

            {/* Error handling */}
            {state.error && (
              <p className="text-sm text-red-600 bg-red-100 border-2 border-red-400 p-2 rounded font-bold">
                {state.error}
              </p>
            )}

            {/* Success feedback (optional, e.g. "Code sent") */}
            {state.message && !state.error && (
              <p className="text-sm text-green-700 font-bold">{state.message}</p>
            )}

            <div className="modal-action flex justify-between mt-6">
              <button
                type="button"
                className="coc-btn coc-btn-grey text-sm py-1 px-3"
                onClick={() => dialogRef.current?.close()}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="coc-btn flex-1 ml-4"
                disabled={isPending}
              >
                {isPending && (
                  <span className="loading loading-spinner loading-xs mr-2"></span>
                )}
                {isOtpStep ? "Verify" : "Send Code"}
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
