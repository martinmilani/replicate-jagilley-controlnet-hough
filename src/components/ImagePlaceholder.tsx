import React from "react";

function ImagePlaceholder() {
  return (
    <div className="">
      <img
        alt="placeholder"
        className="mx-auto h-[300px] w-[430px] rounded object-cover opacity-20"
        src="./placeholder-image.webp"
      />
    </div>
  );
}

export default ImagePlaceholder;
