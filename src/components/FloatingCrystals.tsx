const FloatingCrystals = () => {
  const crystals = [
    { size: 60, top: "10%", left: "15%", delay: "0s", duration: "15s" },
    { size: 45, top: "25%", right: "20%", delay: "3s", duration: "18s" },
    { size: 50, top: "50%", left: "10%", delay: "6s", duration: "20s" },
    { size: 40, top: "70%", right: "15%", delay: "9s", duration: "16s" },
    { size: 55, top: "40%", right: "30%", delay: "12s", duration: "22s" },
    { size: 35, top: "80%", left: "25%", delay: "4s", duration: "19s" },
    { size: 48, top: "15%", left: "45%", delay: "7s", duration: "17s" },
    { size: 42, top: "60%", right: "40%", delay: "10s", duration: "21s" },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {crystals.map((crystal, index) => (
        <div
          key={index}
          className="absolute crystal"
          style={{
            width: `${crystal.size}px`,
            height: `${crystal.size}px`,
            top: crystal.top,
            left: crystal.left,
            right: crystal.right,
            animationDelay: crystal.delay,
            animationDuration: crystal.duration,
          }}
        >
          <div className="crystal-inner" />
        </div>
      ))}
    </div>
  );
};

export default FloatingCrystals;
