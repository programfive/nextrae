"use client";

import React from "react";
import { ClickToComponent } from "click-to-react-component";

export function DevTools() {
  if (process.env.NODE_ENV !== "development") return null;
  return <ClickToComponent />;
}
