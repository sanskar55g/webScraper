export function Button({ children, ...props }) {
  return (
    <button {...props} className="bg-purple-500 hover:bg-purple-700 p-2 rounded-lg">
      {children}
    </button>
  );
}
