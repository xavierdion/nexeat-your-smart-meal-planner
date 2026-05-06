import { User } from "lucide-react";

const Profil = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 gap-4">
    <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
      <User className="text-primary" size={36} />
    </div>
    <h1 className="font-display text-2xl text-primary text-center">Profil</h1>
  </div>
);
export default Profil;