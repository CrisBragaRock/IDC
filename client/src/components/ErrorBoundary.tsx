import { Component, ErrorInfo, ReactNode } from 'react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-950 text-gray-100">
        <p>Algo deu errado</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500"
        >
          Recarregar
        </button>
      </div>
    );
    return this.props.children;
  }
}
