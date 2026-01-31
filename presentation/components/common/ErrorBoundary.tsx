import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * 错误边界组件
 * 捕获子组件树中的 JavaScript 错误，并显示友好的错误提示
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // 更新 state 使下一次渲染能够显示降级后的 UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // 可以将错误日志上报给服务器
    console.error('ErrorBoundary 捕获到错误:', error, errorInfo);

    // 更新 state 以显示错误信息
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // 如果提供了自定义 fallback，则使用自定义 fallback
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // 默认的错误 UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f2f9f1]/50 to-[#fef5f0]/50 p-4">
          <div className="glass-card rounded-[3rem] border-4 border-white shadow-2xl p-12 max-w-lg w-full text-center space-y-6">
            {/* 错误图标 */}
            <div className="w-24 h-24 mx-auto bg-[#f8b195]/10 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-[#f8b195]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>

            {/* 错误标题 */}
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#4a3728]">出现错误</h2>
              <p className="text-[#8eb69b] font-bold">页面遇到了一些问题</p>
            </div>

            {/* 错误信息（开发环境显示） */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left">
                <p className="text-red-800 font-bold text-sm mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="text-red-700 text-xs">
                    <summary className="cursor-pointer font-bold mb-2">
                      错误堆栈
                    </summary>
                    <pre className="whitespace-pre-wrap break-all">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </div>
            )}

            {/* 操作按钮 */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="px-8 py-3 bg-[#f8b195] text-white font-bold rounded-2xl hover:bg-[#f7a384] transition-all shadow-lg shadow-[#f8b195]/20 active:scale-95"
              >
                刷新页面
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-8 py-3 bg-white text-[#4a3728] font-bold rounded-2xl hover:bg-gray-50 transition-all shadow-lg border border-white active:scale-95"
              >
                返回上一页
              </button>
            </div>

            {/* 提示信息 */}
            <p className="text-[#4a3728]/50 text-xs font-bold">
              如果问题持续存在，请联系网站管理员
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;