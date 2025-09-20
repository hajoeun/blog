export const LiquidGlassBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute w-[200%] h-[200%] animate-liquid-rotate">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-full h-full bg-gradient-radial from-purple-500/20 via-transparent to-transparent"
               style={{ backgroundPosition: '20% 80%' }} />
          <div className="absolute w-full h-full bg-gradient-radial from-blue-500/20 via-transparent to-transparent"
               style={{ backgroundPosition: '80% 20%' }} />
          <div className="absolute w-full h-full bg-gradient-radial from-pink-500/20 via-transparent to-transparent"
               style={{ backgroundPosition: '40% 40%' }} />
        </div>
      </div>

      {/* Floating orbs for depth */}
      <div className="glass-orb absolute w-[300px] h-[300px] rounded-full top-[10%] -left-[150px] animate-float" />
      <div className="glass-orb absolute w-[400px] h-[400px] rounded-full bottom-[20%] -right-[200px] animate-float-slow animate-reverse" />
      <div className="glass-orb absolute w-[200px] h-[200px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-float-fast" />
    </div>
  );
};