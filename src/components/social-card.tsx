type Props = {
  children: React.ReactNode;
  className?: string;
};

export const SocialCard = ({ children, className }: Props) => {
  return (
    <div
      className={`rounded-3xl bg-background py-4 px-5 shadow-sm border border-gray-100 dark:border-gray-800 dark:bg-gray-800/50 ${className}`}
    >
      {children}
    </div>
  );
};
