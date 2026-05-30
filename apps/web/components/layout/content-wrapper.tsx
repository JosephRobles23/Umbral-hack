export function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-content mx-auto px-8 pt-10 pb-20">
      {children}
    </div>
  );
}
