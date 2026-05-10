import * as React from 'react';
import * as LucideIcons from 'lucide-react';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export function Icon({ name, className = "", strokeWidth = 2, ...props }: IconProps) {
  // Convert pascal case to hyphen case to match lucide component names if needed
  // or just capitalize the first letter to match the component exports
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.MonitorPlay;
  
  if (!IconComponent) {
    return <span className="text-red-500">?</span>;
  }

  return (
    <IconComponent 
      className={`icon-svg ${className}`} 
      strokeWidth={strokeWidth} 
      {...props} 
    />
  );
}
