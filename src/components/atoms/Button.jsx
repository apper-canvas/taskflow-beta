import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'medium',
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  className = '',
  ...props 
}) => {
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-sm hover:shadow-md',
    secondary: 'bg-surface-100 text-surface-700 hover:bg-surface-200 shadow-sm',
    outline: 'border-2 border-surface-300 text-surface-700 hover:border-primary hover:text-primary',
    ghost: 'text-surface-600 hover:bg-surface-100 hover:text-surface-900',
    danger: 'bg-error text-white hover:bg-error/90 shadow-sm hover:shadow-md'
  };

  const sizes = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-4 py-2 text-base',
    large: 'px-6 py-3 text-lg'
  };

  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-md
    transition-all duration-200 ease-out
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant]}
    ${sizes[size]}
    ${className}
  `;

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          className="w-4 h-4 mr-2 animate-spin" 
        />
      )}
      
      {icon && iconPosition === 'left' && !loading && (
        <ApperIcon 
          name={icon} 
          className="w-4 h-4 mr-2" 
        />
      )}
      
      {children}
      
      {icon && iconPosition === 'right' && !loading && (
        <ApperIcon 
          name={icon} 
          className="w-4 h-4 ml-2" 
        />
      )}
    </motion.button>
  );
};

export default Button;