"use client";
import { useEffect, useState } from "react";
type InlineSVGProps = {
    src?:string | null | undefined,
    className?:string
}
export const InlineSvg = ({ src, className = "" }:InlineSVGProps) => {
  const [svg, setSvg] = useState<string | null | undefined>(null);

  useEffect(() => {
    const loadSvg = async () => {
      const res = src && await fetch(src);
      const text = res && await res.text();
      setSvg(text);
    };

    loadSvg();
  }, [src]);

  if (!svg) return null;

  return (
    <div
      className={`svg-container ${className}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}