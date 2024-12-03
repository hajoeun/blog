type Props = {
  children: React.ReactNode;
  className?: string;
};

export const SocialCard = ({ children, className }: Props) => {
  return (
    <div className={`rounded-3xl bg-background p-6 shadow-sm dark:bg-gray-800/50 ${className}`}>
      {children}
    </div>
  );
};
