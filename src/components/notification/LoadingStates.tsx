import { Inbox } from "lucide-react";
import { NOTIFICATION_MESSAGES } from "./constants";

export const LoadingState = () => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeaderSkeleton />
      <NotificationListSkeleton />
    </div>
  </div>
);

export const HeaderSkeleton = () => (
  <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
    <div className="flex items-center space-x-3">
      <div
        className="h-8 w-8 bg-gray-200 rounded animate-pulse"
        aria-hidden="true"
      />
      <div className="space-y-2">
        <div className="h-8 bg-gray-200 rounded w-32 animate-pulse" />
        <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
      </div>
    </div>
  </div>
);

export const NotificationListSkeleton = () => (
  <div className="bg-white shadow-sm rounded-lg p-6">
    <div className="animate-pulse space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start space-x-3">
          <div
            className="h-2 w-2 bg-gray-300 rounded-full mt-2"
            aria-hidden="true"
          />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-3 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ErrorState = ({
  onRetry,
  error,
}: {
  onRetry: () => void;
  error?: Error;
}) => (
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="text-center py-12">
          <Inbox
            className="mx-auto h-12 w-12 text-red-400"
            aria-hidden="true"
          />
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            {NOTIFICATION_MESSAGES.ERROR_LOADING}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {error?.message || "Something went wrong"}
          </p>
          <button
            onClick={onRetry}
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 transition-colors"
            aria-label="Retry loading notifications"
          >
            Try again
          </button>
        </div>
      </div>
    </div>
  </div>
);
