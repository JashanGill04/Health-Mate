const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full px-16 py-20 bg-gradient-to-br from-[#3e4a61] via-[#586d8c] to-[#32404d] text-white rounded-2xl shadow-2xl">
      <div className="grid grid-cols-3 gap-6 mb-12">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`aspect-square w-16 md:w-20 rounded-2xl ${
              i % 2 === 0 ? "bg-white/20 animate-pulse" : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <h2 className="text-4xl font-bold mb-4 text-center">{title}</h2>
      <p className="text-lg text-white/80 text-center max-w-lg">{subtitle}</p>
    </div>
  );
};

export default AuthImagePattern;
