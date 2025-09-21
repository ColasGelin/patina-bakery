import { get } from 'http';
import React, { forwardRef, ReactNode, CSSProperties } from 'react';

export interface NewsSectionProps {
  id?: string;
  className?: string;
  cutoutText?: string;
  backgroundDiv?: React.CSSProperties;
  foregroundDiv?: React.CSSProperties;
  textStyle?: React.CSSProperties;
  getBackgroundColor?: () => string;
  children?: ReactNode;
  [key: string]: any;
}

export const NewsSection = forwardRef<HTMLElement, NewsSectionProps>(({
  id,
  className = '',
  cutoutText = 'HELLO',
  backgroundDiv = {},
  foregroundDiv = {},
  textStyle = {},
  getBackgroundColor,
  children,
  ...props
}, ref) => {

  const sectionStyles: React.CSSProperties = {
    height: "100vh",
    background: getBackgroundColor ? getBackgroundColor() : '#f0f0f0',
    padding: "4rem 2rem",
    display: "flex",
    flexDirection: "column" as React.CSSProperties['flexDirection'],
    justifyContent: "flex-start" as React.CSSProperties['justifyContent'],
    alignItems: "center" as React.CSSProperties['alignItems'],
    overflow: "hidden",
    transition: "background 0.1s ease-out",
    position: "relative"
  };

  const backgroundDivStyles: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: getBackgroundColor ? getBackgroundColor() : '#f0f0f0',
    borderRadius: "20px",
    ...backgroundDiv
  };

const foregroundDivStyles: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "#ffd29d",
    borderRadius: "20px",
    WebkitMask: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3ctext x='50%25' y='50%25' text-anchor='middle' dy='0.35em' font-family='Arial, sans-serif' font-size='120' font-weight='bold' fill='white'%3e${encodeURIComponent(cutoutText ?? 'HELLO')}%3c/text%3e%3c/svg%3e")`,
    mask: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3ctext x='50%25' y='50%25' text-anchor='middle' dy='0.35em' font-family='Arial, sans-serif' font-size='120' font-weight='bold' fill='white'%3e${encodeURIComponent(cutoutText ?? 'HELLO')}%3c/text%3e%3c/svg%3e")`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
    WebkitMaskComposite: "subtract",
    maskComposite: "subtract",
    ...foregroundDiv
};

  const contentStyles: React.CSSProperties = {
    position: "relative",
    zIndex: 10,
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column" as React.CSSProperties['flexDirection'],
    justifyContent: "flex-start" as React.CSSProperties['justifyContent'],
    alignItems: "center" as React.CSSProperties['alignItems'],
    ...textStyle
  };

  return (
    <section
      ref={ref}
      id={id}
      className={className}
      style={sectionStyles}
      {...props}
    >
      <div style={backgroundDivStyles}></div>
      <div style={foregroundDivStyles}></div>
      <div style={contentStyles}>
        {children}
      </div>
    </section>
  );
});

NewsSection.displayName = "NewsSection";