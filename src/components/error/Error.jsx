import React from "react";
import errorState from "../../states/error";
import { useSnapshot } from "valtio";

export default function Error() {
  const errorSnap = useSnapshot(errorState);

  if (!errorSnap.error) return null;

  return <div style={{ color: "red", padding: "10px 15px", fontSize: 24 }}>{errorSnap.error}</div>;
}
