export interface PageHeadProps {
  title: string;
  sub?: string;
  right?: React.ReactNode;
}

export function PageHead({ title, sub, right }: PageHeadProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-8">
      <div>
        <h1 className="font-display text-[32px] leading-[38px] tracking-[-0.02em] font-medium m-0">
          {title}
        </h1>
        {sub && (
          <p className="text-text-secondary text-sm mt-1 m-0">{sub}</p>
        )}
      </div>
      {right}
    </div>
  );
}
