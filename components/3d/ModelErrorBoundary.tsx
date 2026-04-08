"use client"

import { Component, ReactNode } from "react"

interface Props {
  fallbackImage?: string
  children: ReactNode
}

interface State {
  hasError: boolean
}

export class ModelErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("3D Model Error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(255,255,255,0.02)",
          }}
        >
          {this.props.fallbackImage ? (
            <img
              src={this.props.fallbackImage}
              alt="Product"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
              }}
            />
          ) : (
            <div
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: "13px",
                textAlign: "center",
              }}
            >
              3D view unavailable
            </div>
          )}
        </div>
      )
    }

    return this.props.children
  }
}
