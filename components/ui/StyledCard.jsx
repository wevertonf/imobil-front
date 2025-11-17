// components/ui/StyledCard.jsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export default function StyledCard({ 
  title = "", 
  description = "", 
  footer = null, 
  children, 
  className = ""
}) {
  return (
    <Card className={`shadow-lg hover:shadow-xl transition-shadow duration-300 ${className}`}>
      {(title || description) && (
        <CardHeader className="border-b border-gray-200 pb-4">
          {title && <CardTitle className="text-2xl font-bold text-gray-800">{title}</CardTitle>}
          {description && <CardDescription className="text-gray-600 mt-1">{description}</CardDescription>}
        </CardHeader>
      )}
      <CardContent className="py-6">
        {children}
      </CardContent>
      {footer && (
        <CardFooter className="border-t border-gray-200 bg-gray-50 rounded-b-xl pt-4">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}