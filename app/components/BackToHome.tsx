import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Corner = "top-left" | "top-right" | "bottom-left" | "bottom-right";

interface BackToHomeProps {
  corner?: Corner;
  to?: string;
}

export default function BackToHome({
  corner = "bottom-right",
  to = "/",
}: BackToHomeProps) {
  const cornerClasses = {
    "top-left": "top-4 left-4",
    "top-right": "top-4 right-4",
    "bottom-left": "bottom-4 left-4",
    "bottom-right": "bottom-4 right-4",
  };

  return (
    <Link
      href={to}
      className={`fixed ${cornerClasses[corner]} flex items-center space-x-2 bg-primary text-primary-foreground px-3 py-2 rounded-md shadow-md hover:bg-primary/90 transition-colors duration-200`}
    >
      <ArrowLeft size={20} />
      <span className="hidden sm:inline">Back</span>
    </Link>
  );
}
