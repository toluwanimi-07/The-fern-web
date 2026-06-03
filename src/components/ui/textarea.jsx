export const Textarea = ({ className = "", ...props }) => (
  <textarea
    className={`w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 ${className}`}
    {...props}
  />
);