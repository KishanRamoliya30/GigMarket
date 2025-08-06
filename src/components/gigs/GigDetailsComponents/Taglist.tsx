import { X } from "lucide-react";

export interface TagItem {
  label: string;
  onRemove: () => void;
}

interface TagListProps {
  tags: TagItem[];
}

const TagList = ({ tags }: TagListProps) => {
  if (tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2 mb-4 sm:gap-3">
      {tags.map((tag, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors cursor-default"
        >
          <span>{tag.label}</span>
          <button
            onClick={tag.onRemove}
            className="text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <X size={16} className="stroke-2 cursor-pointer" />
          </button>
        </div>
      ))}
    </div>
  );
};

export default TagList;
