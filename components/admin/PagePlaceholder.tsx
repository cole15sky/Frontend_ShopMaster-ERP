import { LucideIcon, Construction } from "lucide-react";

type Props = {
  title: string;
  description?: string;
  icon?: LucideIcon;
};

export default function PagePlaceholder({ title, description, icon: Icon = Construction }: Props) {
  return (
    <div className="min-h-screen bg-[#0A0C14] text-white p-6 flex flex-col items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
          <Icon size={36} className="text-indigo-400" />
        </div>
        <h1 className="text-3xl font-black mb-3">{title}</h1>
        <p className="text-slate-400 text-lg">
          {description ?? "This module is under active development and will be available soon."}
        </p>
        <div className="mt-8 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full inline-block">
          <span className="text-indigo-400 text-sm font-medium">Coming Soon</span>
        </div>
      </div>
    </div>
  );
}
