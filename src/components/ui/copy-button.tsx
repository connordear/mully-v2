import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "./button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip";

type CopyButtonPropsType = {
  text: string;
  hoverText?: string;
};
const CopyButton = ({ text, hoverText = "Copy" }: CopyButtonPropsType) => {
  const [copied, setCopied] = useState(false);
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            style={{
              height: "1.2rem",
              width: "1.2rem",
              margin: "0.5px",
            }}
            onClick={() => {
              navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{copied ? "Copied!" : hoverText}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CopyButton;
