"use client";

function Shimmer({ className }: { className?: string }) {
  return <div className={`shimmer ${className || ""}`} />;
}

function AboutSkeleton() {
  return (
    <div className="mb-12">
      <Shimmer className="h-8 w-48 mb-4" />
      <div className="card-surface rounded-xl p-6">
        <Shimmer className="h-4 w-full mb-3" />
        <Shimmer className="h-4 w-full mb-3" />
        <Shimmer className="h-4 w-3/4 mb-3" />
        <Shimmer className="h-4 w-full mb-3" />
        <Shimmer className="h-4 w-5/6" />
      </div>
    </div>
  );
}

function PostCardSkeleton({ hasImage }: { hasImage?: boolean }) {
  return (
    <div className="card-surface rounded-xl p-5">
      {hasImage && <Shimmer className="!rounded-t-xl !rounded-b-none h-48 -mx-5 -mt-5 mb-4" />}
      <Shimmer className="h-6 w-3/4 mb-3" />
      <Shimmer className="h-4 w-full mb-2" />
      <Shimmer className="h-4 w-2/3 mb-4" />
      <div className="flex gap-3">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-3 w-32" />
      </div>
    </div>
  );
}

function PostsSkeleton() {
  return (
    <div className="mb-12">
      <Shimmer className="h-8 w-40 mb-6" />
      <div className="space-y-4">
        <PostCardSkeleton hasImage />
        <PostCardSkeleton />
        <PostCardSkeleton hasImage />
        <PostCardSkeleton />
      </div>
    </div>
  );
}

function ExperienceSkeleton() {
  return (
    <div className="mb-12">
      <Shimmer className="h-8 w-40 mb-6" />
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="card-surface rounded-xl p-5">
            <div className="flex items-start justify-between mb-2">
              <Shimmer className="h-6 w-48" />
              <Shimmer className="h-4 w-32" />
            </div>
            <Shimmer className="h-4 w-36 mb-3" />
            <Shimmer className="h-4 w-full mb-2" />
            <Shimmer className="h-4 w-5/6 mb-4" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((j) => (
                <Shimmer key={j} className="h-6 w-16" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="mb-12">
      <Shimmer className="h-8 w-32 mb-6" />
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card-surface rounded-xl p-5">
            <Shimmer className="h-6 w-40 mb-3" />
            <Shimmer className="h-4 w-full mb-2" />
            <Shimmer className="h-4 w-3/4 mb-4" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((j) => (
                <Shimmer key={j} className="h-6 w-14" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsSkeleton() {
  return (
    <div className="mb-12">
      <Shimmer className="h-8 w-24 mb-6" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card-surface rounded-xl p-4">
            <Shimmer className="h-5 w-28 mb-3" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4].map((j) => (
                <Shimmer key={j} className="h-7 w-16" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col items-center p-6">
      <Shimmer className="!rounded-full w-28 h-28 mb-4" />
      <Shimmer className="h-6 w-40 mb-2" />
      <Shimmer className="h-4 w-52" />
    </div>
  );
}

function TrendingSkeleton() {
  return (
    <div className="hidden xl:block w-64 shrink-0">
      <Shimmer className="h-6 w-36 mb-4" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <Shimmer className="h-5 w-5 !rounded-full" />
            <Shimmer className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PostDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4">
        <Shimmer className="h-4 w-12" />
        <Shimmer className="h-4 w-2" />
        <Shimmer className="h-4 w-48" />
      </div>

      <div className="mb-12">
        {/* Cover image */}
        <Shimmer className="!rounded-xl h-[300px] w-full mb-6" />

        {/* Title */}
        <Shimmer className="h-9 w-3/4 mb-2" />

        {/* Description */}
        <Shimmer className="h-4 w-full mb-1" />
        <Shimmer className="h-4 w-2/3 mb-4" />

        {/* Date & work time */}
        <div className="flex gap-3 mb-6">
          <Shimmer className="h-4 w-28" />
          <Shimmer className="h-4 w-20" />
        </div>

        {/* Content paragraphs */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <Shimmer className="h-4 w-full mb-2" />
              <Shimmer className="h-4 w-full mb-2" />
              <Shimmer className="h-4 w-5/6 mb-2" />
              {i % 2 === 0 && <Shimmer className="h-4 w-3/4" />}
            </div>
          ))}
        </div>

        {/* Categories & Tags */}
        <div className="mt-8 pt-6 border-t border-[var(--border-color)]">
          <div className="flex items-center gap-2 mb-4">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-7 w-24 !rounded" />
            <Shimmer className="h-7 w-20 !rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Shimmer className="h-4 w-12" />
            <Shimmer className="h-7 w-16 !rounded" />
            <Shimmer className="h-7 w-20 !rounded" />
            <Shimmer className="h-7 w-14 !rounded" />
          </div>
        </div>
      </div>

      {/* Further Reading */}
      <div>
        <Shimmer className="h-7 w-40 mb-4" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-surface rounded-lg p-4">
              <Shimmer className="h-5 w-3/4 mb-2" />
              <Shimmer className="h-3 w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="max-w-4xl mx-auto">
      <AboutSkeleton />
      <PostsSkeleton />
      <ExperienceSkeleton />
      <ProjectsSkeleton />
      <SkillsSkeleton />
    </div>
  );
}

export { SidebarSkeleton, TrendingSkeleton };
