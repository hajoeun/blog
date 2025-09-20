type Props = {
  children: React.ReactNode;
  className?: string;
};

export const SocialCard = ({ children, className }: Props) => {
  return (
    <div
      className={`glass-card dark:glass-card-dark rounded-3xl py-4 px-5
                  hover:scale-[1.02] hover:backdrop-blur-2xl hover:backdrop-saturate-200 hover:brightness-110
                  hover:shadow-glass-hover active:scale-[0.98] active:transition-none
                  transition-all duration-300 relative overflow-hidden ${className || ''}`}
    >
      {children}
    </div>
  );
};
