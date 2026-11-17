import { Component } from 'react';

export class ErrorBoundary extends Component<any> {
  render() {
    return this.props.children;
  }
}