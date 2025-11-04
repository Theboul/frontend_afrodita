import React from 'react';

type State = { error: any };

export default class DevErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: any) {
    return { error };
  }

  componentDidCatch(error: any, info: any) {
    // Log al console para diagnóstico
    // eslint-disable-next-line no-console
    console.error('Runtime error:', error, info);
  }

  render() {
    if (this.state.error) {
      const message = this.state.error?.message || String(this.state.error);
      const stack = this.state.error?.stack || '';
      return (
        <div style={{ padding: 16 }}>
          <h3 style={{ color: '#b00020', marginBottom: 8 }}>Se produjo un error en la aplicación</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#fff5f5', padding: 12, borderRadius: 8, color: '#8a0000' }}>
            {message}\n\n{stack}
          </pre>
        </div>
      );
    }
    return this.props.children as React.ReactElement;
  }
}

