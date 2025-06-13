import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false,
  onChange,
  label,
  disabled = false,
  className = '',
  ...props 
}) => {
  const handleChange = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <motion.button
        type="button"
        onClick={handleChange}
        disabled={disabled}
        className={`
          relative w-5 h-5 rounded border-2 
          transition-all duration-200 ease-out
          focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2
          ${checked 
            ? 'bg-primary border-primary' 
            : 'bg-white border-surface-300 hover:border-primary'
          }
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        `}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
        {...props}
      >
        <motion.div
          initial={false}
          animate={{
            scale: checked ? 1 : 0,
            opacity: checked ? 1 : 0
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <ApperIcon 
            name="Check" 
            className="w-3 h-3 text-white" 
          />
        </motion.div>
      </motion.button>
      
      {label && (
        <label 
          onClick={handleChange}
          className={`
            text-sm font-medium text-surface-700
            ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          `}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;