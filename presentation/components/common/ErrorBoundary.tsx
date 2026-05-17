import type { FC, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const ErrorBoundary: FC<ErrorBoundaryProps> = ({ children, fallback }) => {
  if (fallback) {
    return <>{children ?? fallback}</>;
  }
  return <>{children}</>;
};

export default ErrorBoundary;
