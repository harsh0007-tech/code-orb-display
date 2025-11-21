const BackgroundOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      <div className="orb orb-purple w-96 h-96 top-20 left-10"></div>
      <div className="orb orb-teal w-80 h-80 top-1/3 right-20" style={{ animationDelay: "5s" }}></div>
      <div className="orb orb-blue w-72 h-72 bottom-20 left-1/4" style={{ animationDelay: "10s" }}></div>
      <div className="orb orb-purple w-64 h-64 bottom-1/3 right-1/3" style={{ animationDelay: "15s" }}></div>
    </div>
  );
};

export default BackgroundOrbs;
