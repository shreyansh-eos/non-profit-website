import React from 'react';

export const SurvivorStoryCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#17243A]/10 shadow-xs p-7 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Category & Author pill placeholder */}
        <div className="flex items-center gap-2 mb-4">
          <div className="h-3 w-28 rounded-md shimmer-box" />
          <div className="h-1.5 w-1.5 rounded-full bg-[#17243A]/20" />
          <div className="h-3 w-32 rounded-md shimmer-box" />
        </div>

        {/* Title placeholder */}
        <div className="space-y-2 mb-4">
          <div className="h-5 w-4/5 rounded-md shimmer-box" />
          <div className="h-5 w-3/5 rounded-md shimmer-box" />
        </div>

        {/* Excerpt lines */}
        <div className="space-y-2.5 mb-6">
          <div className="h-3.5 w-full rounded-md shimmer-box" />
          <div className="h-3.5 w-11/12 rounded-md shimmer-box" />
          <div className="h-3.5 w-4/5 rounded-md shimmer-box" />
        </div>
      </div>

      {/* Footer & Read More button placeholder */}
      <div className="pt-4 border-t border-[#17243A]/5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-3 w-24 rounded-md shimmer-box" />
          <div className="h-3 w-16 rounded-md shimmer-box" />
        </div>
        <div className="h-9 w-full rounded-xl shimmer-box" />
      </div>
    </div>
  );
};

export const StoryCardSkeleton = SurvivorStoryCardSkeleton;

export const StorytellingSkeletonGrid: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <SurvivorStoryCardSkeleton key={`story-skeleton-${i}`} />
      ))}
    </div>
  );
};

export const ResourceCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-[#17243A]/10 p-6 sm:p-7 flex flex-col justify-between shadow-2xs overflow-hidden">
      <div>
        {/* Category & Read Time */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-28 rounded-md shimmer-box" />
          <div className="h-3 w-16 rounded-md shimmer-box" />
        </div>

        {/* Title */}
        <div className="space-y-2 mb-3">
          <div className="h-5 w-3/4 rounded-md shimmer-box" />
          <div className="h-5 w-1/2 rounded-md shimmer-box" />
        </div>

        {/* Summary */}
        <div className="space-y-2 mb-4">
          <div className="h-3.5 w-full rounded-md shimmer-box" />
          <div className="h-3.5 w-5/6 rounded-md shimmer-box" />
        </div>

        {/* Key Takeaway Box */}
        <div className="p-3.5 bg-[#F8F7F3] rounded-xl border border-[#17243A]/10 space-y-2 mb-4">
          <div className="h-2.5 w-20 rounded-md shimmer-box" />
          <div className="h-3 w-4/5 rounded-md shimmer-box" />
        </div>
      </div>

      {/* Footer Tag */}
      <div className="pt-3 border-t border-[#17243A]/5 flex items-center justify-between">
        <div className="h-3 w-24 rounded-md shimmer-box" />
        <div className="h-3.5 w-3.5 rounded-full shimmer-box" />
      </div>
    </div>
  );
};

export const ResourcesSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ResourceCardSkeleton key={`resource-skeleton-${i}`} />
      ))}
    </div>
  );
};

export const SupportCardSkeleton: React.FC = () => {
  return (
    <div className="bg-[#F8F7F3] rounded-2xl border border-[#17243A]/10 p-6 sm:p-7 flex flex-col justify-between shadow-2xs overflow-hidden">
      <div>
        {/* Header metadata */}
        <div className="flex items-center justify-between mb-3">
          <div className="h-3 w-28 rounded-md shimmer-box" />
          <div className="h-4 w-20 rounded-md shimmer-box" />
        </div>

        {/* Name */}
        <div className="h-5 w-3/4 rounded-md shimmer-box mb-2" />
        <div className="h-3 w-40 rounded-md shimmer-box mb-3" />

        {/* Description */}
        <div className="space-y-2 mb-5">
          <div className="h-3.5 w-full rounded-md shimmer-box" />
          <div className="h-3.5 w-5/6 rounded-md shimmer-box" />
        </div>

        {/* Details */}
        <div className="space-y-2 mb-6">
          <div className="h-3 w-32 rounded-md shimmer-box" />
          <div className="h-3 w-44 rounded-md shimmer-box" />
          <div className="h-3 w-28 rounded-md shimmer-box" />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-[#17243A]/10 flex items-center gap-2">
        <div className="h-9 flex-1 rounded-xl shimmer-box" />
        <div className="h-9 w-24 rounded-xl shimmer-box" />
      </div>
    </div>
  );
};

export const SupportSkeletonGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
      {Array.from({ length: count }).map((_, i) => (
        <SupportCardSkeleton key={`support-skeleton-${i}`} />
      ))}
    </div>
  );
};
