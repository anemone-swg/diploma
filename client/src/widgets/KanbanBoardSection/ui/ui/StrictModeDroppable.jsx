import { useEffect, useState } from "react";
import { Droppable } from "react-beautiful-dnd";

export const StrictModeDroppable = ({
  children,
  enabled = false,
  ...props
}) => {
  const [isEnabled, setIsEnabled] = useState(enabled);

  useEffect(() => {
    const animation = requestAnimationFrame(() => setIsEnabled(true));

    return () => {
      cancelAnimationFrame(animation);
      setIsEnabled(false);
    };
  }, []);

  if (!isEnabled) {
    return null;
  }

  return <Droppable {...props}>{children}</Droppable>;
};
