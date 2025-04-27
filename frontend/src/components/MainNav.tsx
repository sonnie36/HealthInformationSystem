
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface MainNavProps extends React.HTMLAttributes<HTMLElement> {
  items?: {
    href: string;
    title: string;
  }[];
}

export function MainNav({ className, items, ...props }: MainNavProps) {
  const [active, setActive] = useState<string>("/");

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {items?.map((item) => (
        <Button
          key={item.href}
          variant={active === item.href ? "default" : "ghost"}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            active === item.href
              ? "text-white bg-healthcare-primary"
              : "text-healthcare-gray"
          )}
          onClick={() => setActive(item.href)}
        >
          {item.title}
        </Button>
      ))}
    </nav>
  );
}
