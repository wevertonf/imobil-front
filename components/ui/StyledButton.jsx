// components/ui/StyledButton.jsx
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function StyledButton({ 
  children, 
  variant = "default", // "default", "destructive", "outline", "secondary", "ghost", "link"
  size = "default",    // "default", "sm", "lg", "icon"
  className = "",
  href = null,         // Se for um botão de link
  onClick = null,      // Se for um botão de ação
  ...props 
}) {
  const buttonElement = (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </Button>
  );

  if (href) {
    return <Link href={href}>{buttonElement}</Link>;
  }

  return buttonElement;
}