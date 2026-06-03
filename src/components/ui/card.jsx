export const Card = ({ children, className = "" }) => (
  <div className={`rounded-lg border border-slate-800 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = "" }) => (
  <div className={className}>{children}</div>
);