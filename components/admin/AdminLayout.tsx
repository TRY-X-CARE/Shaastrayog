"use client";

import React from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="d-flex min-vh-100">
      <div className="flex-grow-1 d-flex flex-column">
        <div className="flex-grow-1">{children}</div>
      </div>
    </div>
  );
}
