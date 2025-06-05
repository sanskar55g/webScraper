export function Progress({ value }) {
    return (
      <div className="w-full h-2 bg-gray-600 rounded-lg overflow-hidden mt-3">
        <div className="h-full bg-green-400 transition-all" style={{ width: `${value}%` }}></div>
      </div>
    );
  }
  