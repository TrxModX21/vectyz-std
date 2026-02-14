"use client";

import { useEffect, useState } from "react";

const HeaderDateTime = () => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000 * 60); // Update every minute

    return () => clearInterval(timer);
  }, []);

  // Format: "Oct 08 | 19.00"
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).replace(":", ".");

  return (
    <p
      className="text-muted-foreground hidden font-medium md:inline-block"
      suppressHydrationWarning
    >
      {formattedDate} | {formattedTime}
    </p>
  );
};

export default HeaderDateTime;
