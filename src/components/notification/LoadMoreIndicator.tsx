import { forwardRef } from "react";
import { NOTIFICATION_MESSAGES } from "./constants";
import {
  LoadMoreIndicatorProps,
  ScrollSentinelProps,
} from "@/app/utils/interfaces";

export function LoadMoreIndicator({
  isFetchingNextPage,
  hasNextPage,
  notificationsCount,
}: LoadMoreIndicatorProps) {
  if (isFetchingNextPage) {
    return (
      <div className="mt-6 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700">
          <div
            className="w-4 h-4 border-2 border-gray-300 border-t-green-600 rounded-full animate-spin"
            role="status"
            aria-label={NOTIFICATION_MESSAGES.LOADING_MORE}
          />
          <span>{NOTIFICATION_MESSAGES.LOADING_MORE}</span>
        </div>
      </div>
    );
  }

  if (!hasNextPage && notificationsCount > 0) {
    return (
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">{NOTIFICATION_MESSAGES.NO_MORE}</p>
      </div>
    );
  }

  return null;
}

export const ScrollSentinel = forwardRef<HTMLDivElement, ScrollSentinelProps>(
  ({ hasNextPage, isFetchingNextPage }, ref) => (
    <div ref={ref} className="h-20 flex items-center justify-center">
      {hasNextPage && !isFetchingNextPage && (
        <div className="text-sm text-gray-400">
          {NOTIFICATION_MESSAGES.SCROLL_TO_LOAD}
        </div>
      )}
    </div>
  )
);

ScrollSentinel.displayName = "ScrollSentinel";
