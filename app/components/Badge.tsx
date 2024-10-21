import { cn } from "@/lib/utils";
import { ReactNode } from "react";

import React from "react";

class Badge extends React.Component<{
  children: ReactNode;
  className?: string;
  [key: string]: any;
}> {
  render() {
    const { children, className, ...props } = this.props;
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          className
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
}

export { Badge };