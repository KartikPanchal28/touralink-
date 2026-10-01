import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('[Touralink ErrorBoundary Caught]:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[300px] w-full p-6 sm:p-10 flex items-center justify-center bg-slate-950/90 text-white rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
          <div className="max-w-md text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto shadow-lg">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-white">Something went wrong rendering this section</h3>
              <p className="text-xs text-slate-300 font-medium mt-1">
                {this.state.error?.message || 'An unexpected rendering error occurred.'}
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  window.location.hash = '';
                  window.location.reload();
                }}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center gap-1.5 border border-white/20 active:scale-95 transition-all cursor-pointer"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Return Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
