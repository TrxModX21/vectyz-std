import { Copy, Trash2 } from "lucide-react";

interface Props {
  counter: number;
  maxCounter: string | number;
  inputName?: string;
  onCopy: () => void;
  onDelete: () => void;
}

export function StockInputExtension({
  counter,
  maxCounter,
  inputName = "title",
  onCopy,
  onDelete,
}: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-medium text-cyber-body-subtle tabular-nums">
        {counter}/{maxCounter}
      </span>
      <div className="flex items-center gap-1 rounded-sm border border-cyber-border bg-cyber-surface-active p-0.5 shadow-inner">
        <button
          type="button"
          onClick={onCopy}
          title={`Copy ${inputName}`}
          className="flex h-6 w-6 items-center justify-center rounded-[2px] text-cyber-body-subtle hover:bg-cyber-surface-hover hover:text-neon transition-colors focus:outline-none"
        >
          <Copy size={13} />
        </button>
        <div className="h-4 w-px bg-cyber-border-subtle" />
        <button
          type="button"
          onClick={onDelete}
          title={`Clear ${inputName}`}
          className="flex h-6 w-6 items-center justify-center rounded-[2px] text-cyber-body-subtle hover:bg-[#FF3366]/10 hover:text-[#FF3366] transition-colors focus:outline-none"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}

export default StockInputExtension;
