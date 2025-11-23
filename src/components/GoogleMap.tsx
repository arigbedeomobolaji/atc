"use client";

export const GoogleMap = () => {
  return (
    <div className="w-full h-96 rounded-xl overflow-hidden shadow">
      <iframe
        width="100%"
        height="100%"
        loading="lazy"
        allowFullScreen
        src="https://www.google.com/maps?q=10.6101,7.4296&hl=en&z=14&output=embed"
      ></iframe>
    </div>
  );
};
