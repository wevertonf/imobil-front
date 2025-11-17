// components/ui/StyledInput.jsx
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StyledInput({ 
  label, 
  id, 
  name, 
  type = "text", 
  placeholder, 
  required = false, 
  value, 
  onChange, 
  error = null, 
  className = "" 
}) {
  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className={`focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border-gray-300 ${error ? 'border-red-500' : ''} ${className}`}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}