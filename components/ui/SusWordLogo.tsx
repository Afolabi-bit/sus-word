"use client";

import React from "react";

interface SusWordLogoProps {
  size?: number;
  className?: string;
}

/**
 * Clean SVG logo for SusWord — orange rounded square with a magnifying glass
 * containing a suspicious face (two eyes + frown).
 */
export default function SusWordLogo({ size = 96, className = "" }: SusWordLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Orange rounded square background */}
      <rect width="120" height="120" rx="28" fill="#EF9F27" />

      {/* Magnifying glass circle (lens) */}
      <circle
        cx="55"
        cy="52"
        r="26"
        stroke="#3D2A0E"
        strokeWidth="7"
        fill="none"
      />

      {/* Magnifying glass handle */}
      <line
        x1="74"
        y1="72"
        x2="96"
        y2="94"
        stroke="#3D2A0E"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Suspicious face — left eye */}
      <circle cx="46" cy="48" r="3.5" fill="#3D2A0E" />

      {/* Suspicious face — right eye */}
      <circle cx="64" cy="48" r="3.5" fill="#3D2A0E" />

      {/* Suspicious face — frown */}
      <path
        d="M46 61 C50 57, 60 57, 64 61"
        stroke="#3D2A0E"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
