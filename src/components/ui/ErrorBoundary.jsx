import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-6">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-ink-900 mb-2">Terjadi kesalahan</h2>
            <p className="text-sm text-ink-500 mb-4">Silakan muat ulang halaman.</p>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary-600 hover:underline"
            >
              Muat Ulang
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
