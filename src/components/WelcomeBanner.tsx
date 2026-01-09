import { Facebook, Instagram, Youtube } from "lucide-react";

export function WelcomeBanner() {
  return (
    <div className="bg-blue-950/95 text-white p-3 lg:px-9   border-b-8 border-b-yellow-300 shadow-md hover:shadow-lg">
      <div className="flex items-center justify-between  max-w-7xl mx-auto">
        {/* Welcome Text */}
        <h1 className="text-xs sm:text-sm lg:text-xl font-mono shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 break-words max-w-[200px] sm:max-w-none text-center">
          WELCOME TO AIR TRAINING COMMAND
        </h1>
        {/* Social Media Icons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 items-center">
          <Facebook className="shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300" />
          <Instagram className="shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300" />
          <Youtube className="shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300" />
        </div>
      </div>
    </div>
  );
}
