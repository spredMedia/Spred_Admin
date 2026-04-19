"use client";

import { useState } from "react";
import { CheckCircle2, Trash2, AlertTriangle, Zap, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkModerationPanelProps {
  selectedCount: number;
  onApproveAll: () => void;
  onRejectAll: () => void;
  onRemoveAll: () => void;
  onCancel: () => void;
  isProcessing?: boolean;
}

export function BulkModerationPanel({
  selectedCount,
  onApproveAll,
  onRejectAll,
  onRemoveAll,
  onCancel,
  isProcessing = false,
}: BulkModerationPanelProps) {
  const [confirmAction, setConfirmAction] = useState<string | null>(null);
  const [selectedReason, setSelectedReason] = useState<string>("");

  if (selectedCount === 0) return null;

  const rejectionReasons = [
    "Violates community standards",
    "Spam or misleading content",
    "Copyrighted material",
    "Harassment or hate speech",
    "Adult content",
    "Misinformation",
    "Other",
  ];

  const handleAction = (action: "approve" | "reject" | "remove") => {
    if (action === "reject" && !selectedReason) {
      alert("Please select a rejection reason");
      return;
    }

    switch (action) {
      case "approve":
        onApproveAll();
        break;
      case "reject":
        onRejectAll();
        break;
      case "remove":
        onRemoveAll();
        break;
    }

    setConfirmAction(null);
    setSelectedReason("");
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="mx-4 mb-4 glass-card rounded-[2.5rem] border-white/10 p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-6">
          {/* Selected Count */}
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">
                {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Choose an action to proceed
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 flex-wrap justify-end">
            {/* Approve Button */}
            <button
              onClick={() => setConfirmAction("approve")}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              Approve
            </button>

            {/* Reject Button */}
            <button
              onClick={() => setConfirmAction("reject")}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm transition-all"
            >
              <AlertTriangle className="h-4 w-4" />
              Reject
            </button>

            {/* Remove Button */}
            <button
              onClick={() => setConfirmAction("remove")}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm transition-all"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>

            {/* Cancel Button */}
            <button
              onClick={onCancel}
              disabled={isProcessing}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 text-white hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm transition-all border border-white/10"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
          </div>
        </div>

        {/* Confirmation Panel */}
        {confirmAction && (
          <div className="mt-6 pt-6 border-t border-white/5 space-y-4 animate-in fade-in duration-200">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-zinc-950/50 border border-white/5">
              <Zap className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-bold text-white text-sm">
                  {confirmAction === "approve"
                    ? "Approve these items?"
                    : confirmAction === "reject"
                      ? "Reject these items?"
                      : "Remove these items permanently?"}
                </p>
                <p className="text-xs text-zinc-400 mt-1">
                  This action will be logged and can be reviewed in moderation history.
                </p>
              </div>
            </div>

            {/* Rejection Reason Dropdown */}
            {confirmAction === "reject" && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-500 uppercase">
                  Rejection Reason
                </label>
                <select
                  value={selectedReason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white text-sm focus:outline-none focus:border-primary transition-all"
                >
                  <option value="">Select a reason...</option>
                  {rejectionReasons.map((reason) => (
                    <option key={reason} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Confirmation Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() =>
                  handleAction(
                    confirmAction as "approve" | "reject" | "remove"
                  )
                }
                disabled={isProcessing}
                className={cn(
                  "flex-1 px-4 py-2 rounded-lg font-bold text-sm transition-all disabled:opacity-50",
                  confirmAction === "approve"
                    ? "bg-emerald-500 text-white hover:shadow-lg hover:shadow-emerald-500/25"
                    : confirmAction === "reject"
                      ? "bg-amber-500 text-white hover:shadow-lg hover:shadow-amber-500/25"
                      : "bg-rose-500 text-white hover:shadow-lg hover:shadow-rose-500/25"
                )}
              >
                {isProcessing ? "Processing..." : "Confirm"}
              </button>
              <button
                onClick={() => {
                  setConfirmAction(null);
                  setSelectedReason("");
                }}
                disabled={isProcessing}
                className="flex-1 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-sm hover:bg-white/10 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
