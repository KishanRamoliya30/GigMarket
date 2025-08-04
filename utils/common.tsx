export const formatTimeAgo = (
  inputTime: string | Date | undefined | null
): string => {
  if (!inputTime) return "Unknown";

  const createdAt = new Date(inputTime);
  if (isNaN(createdAt.getTime())) return "Invalid date";

  const now = Date.now();
  const createdTime = createdAt.getTime();
  const diffInMinutes = Math.floor((now - createdTime) / (1000 * 60));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
};

export const addEllipsis = (
  str: string,
  maxLength: number
): React.ReactNode => {
  if (str.length > maxLength) {
    return <div title={str}>{str.substring(0, 30)}...</div>;
  }
  return str;
};
