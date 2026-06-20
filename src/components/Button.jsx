export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}) {
  const styles = {
    primary:
      "bg-blue-600 text-white",

    secondary:
      "bg-white text-blue-600 border border-blue-200",

    ghost:
      "text-blue-400 bg-transparent",
  };

  return (
    <button
      onClick={onClick}
      className={`
        text-xs
        px-3
        py-1.5
        rounded-lg
        font-medium
        transition-all
        active:scale-95
        ${styles[variant]}
        ${className}
      `}>
      {children}
    </button>
  );
}