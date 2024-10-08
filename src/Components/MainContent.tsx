// components/MainContent.tsx
interface MainContentProps {
  children: React.ReactNode;
}

export default function MainContent({ children }: MainContentProps) {
  return <div className="flex-1 overflow-auto">{children}</div>;
}
