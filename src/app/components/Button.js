export default function Button({ text, onClick }) {
  return (
    <button
      className="bg-header text-foreground-light font-bold cursor-pointer min-w-36 h-10 rounded-lg hover:bg-accent hover:text-white"
      onClick={onClick}
    >
      {text}
    </button>
  );
}
