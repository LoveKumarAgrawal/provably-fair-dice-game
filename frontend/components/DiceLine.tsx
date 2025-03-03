import { useState, useEffect } from "react";

const DiceLine = ({ result }: { result: number | null }) => {
  const [value, setValue] = useState(result);
  const marks = [1, 2, 3, 4, 5, 6];

  useEffect(() => {
    if (result) {
      setValue(result);
    }
  }, [result]);

  return (
    <div className="relative w-full max-w-3xl mx-auto p-6 bg-[#0f172a] rounded-lg">
      {/* Number Markers & Tag (Now at the Top) */}
      <div className="relative flex justify-between text-white mb-4">
        {marks.map((mark) => (
          <div key={mark} className="relative w-1/6 text-center">
            {value === mark && (
              <div className="absolute z-20 bottom-[-52px] left-1/2 transform -translate-x-1/2 bg-blue-400 text-gray-800 rounded shadow w-8 h-8 flex justify-center items-center">|||</div>
            )}
            <span>{mark}</span>
          </div>
        ))}
      </div>

      {/* Marker Line (Now at the Bottom) */}
      <div className="relative h-10 rounded-full bg-[#334155] flex items-center">
        <div className="absolute h-3 rounded-full left-0 bg-red-500" style={{ width: "50%" }}></div>
        <div className="absolute h-3 rounded-full bg-green-500" style={{ left: "50%", width: "50%" }}></div>
      </div>
    </div>
  );
}


export default DiceLine;