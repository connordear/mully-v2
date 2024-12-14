import { ReactNode } from "react";

type LabelDisplayPropsType = {
  label: string;
  content: ReactNode;
  columnWidth?: string;
  stacked?: boolean;
  hidden?: boolean;
};
const LabelDisplay = ({
  label,
  content,
  columnWidth = "80px",
  stacked = false,
  hidden = false,
}: LabelDisplayPropsType) => {
  if (!content || hidden) return null;
  const className = stacked ? "flex flex-col gap-1" : "flex flex-row gap-2";
  return (
    <div className={className}>
      <h2
        className="font-semibold"
        style={{
          textAlign: stacked ? "left" : "right",
          width: stacked ? "auto" : columnWidth,
          flexShrink: 0,
        }}
      >
        {label}
        {stacked ? "" : ":"}
      </h2>
      <p style={{ fontWeight: 400 }}>{content}</p>
    </div>
  );
};

export default LabelDisplay;
