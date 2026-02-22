"use client";

import { useActionState, useRef } from "react";
import { useFormState } from "react-dom";
import { uploadBase } from "../actions/base";

export default function UploadBaseDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, formAction, isPending] = useActionState(uploadBase, null);

  return (
    <div>
      <button
        className="btn btn-primary"
        onClick={() => dialogRef.current?.showModal()}
      >
        Upload Base
      </button>

      {/* DaisyUI Modal */}
      <dialog ref={dialogRef} className="modal">
        <div className="modal-box w-full max-w-lg">
          <h3 className="font-bold text-xl mb-6">Upload Base</h3>

          <form action={formAction} className="space-y-5">
            {/* Base Link */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Enter Base Link</span>
              </label>
              <input
                type="text"
                name="baseLink"
                required
                placeholder="https://example.com/base-link"
                className="input input-bordered w-full"
              />
            </div>

            {/* TH Level */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Enter TH Level</span>
              </label>
              <input
                type="number"
                name="thLevel"
                required
                min="1"
                max="16"
                placeholder="15"
                className="input input-bordered w-full"
              />
            </div>

            {/* Preview Image URL */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Preview Image URL</span>
              </label>
              <input
                type="text"
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                className="input input-bordered w-full"
              />
            </div>

            {/* OR Upload Image */}
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Or Upload Image</span>
              </label>
              <input
                type="file"
                name="imageFile"
                accept="image/*"
                className="file-input file-input-bordered w-full"
              />
            </div>

            {/* Actions */}
            <div className="modal-action">
              <button
                type="button"
                className="btn"
                onClick={() => dialogRef.current?.close()}
              >
                Cancel
              </button>

              <button type="submit" className="btn btn-primary">
                Upload
              </button>
            </div>
          </form>
        </div>

        {/* Click outside to close */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
