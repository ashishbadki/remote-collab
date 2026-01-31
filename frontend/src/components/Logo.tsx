import { Rocket } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center">
        <Rocket className="text-white w-5 h-5" />
      </div>
      <span className="text-xl font-semibold text-indigo-600">
        RemoteCollab
      </span>
    </div>
  );
};
