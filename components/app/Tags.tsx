import React from "react";

const macOSTagColors = [
  { title: "Work", name: "Red", hex: "#FF665E" },
  { title: "Cool", name: "Orange", hex: "#FFA000" },
  { title: "Music", name: "Yellow", hex: "#FFE000" },
  { title: "Enterprise", name: "Green", hex: "#00F449" },
  { title: "Games", name: "Blue", hex: "#00AFFF" },
  { title: "Movie theatre", name: "Purple", hex: "#FF7FFF" },
  { title: "Jubmi", name: "Gray", hex: "#ACA8AC" },
];

export default function Tags() {
  return (
    <div className="flex gap-4 mt-4">
      {macOSTagColors.map((item) => (
        <div
          key={item.hex}
          className="border border-black/70 px-3 py-0.5 rounded-full flex gap-1.5 items-center cursor-pointer"
        >
          <span
            className={`h-2 w-2 rounded-full`}
            style={{
              background: item.hex,
            }}
          />
          {item.title}
        </div>
      ))}
    </div>
  );
}
