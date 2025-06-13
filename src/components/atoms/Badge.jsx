import ApperIcon from '@/components/ApperIcon';

const Badge = ({ 
  children, 
  variant = 'default',
  size = 'medium',
  icon,
  className = '',
  ...props 
}) => {
  const variants = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-primary/10 text-primary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    high: 'bg-error/10 text-error',
    medium: 'bg-warning/10 text-warning',
    low: 'bg-success/10 text-success'
  };

  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    medium: 'px-2.5 py-1 text-sm',
    large: 'px-3 py-1.5 text-base'
  };

  const baseClasses = `
    inline-flex items-center
    font-medium rounded-full
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return (
    <span className={baseClasses} {...props}>
      {icon && (
        <ApperIcon 
          name={icon} 
          className="w-3 h-3 mr-1" 
        />
      )}
      {children}
    </span>
  );
};

export default Badge;