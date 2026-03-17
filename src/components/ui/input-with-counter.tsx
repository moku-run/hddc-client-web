import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface InputWithCounterProps
  extends Omit<React.ComponentProps<typeof Input>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  maxLength: number;
}

export function InputWithCounter({
  value,
  onChange,
  maxLength,
  className,
  ...props
}: InputWithCounterProps) {
  return (
    <div>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        maxLength={maxLength}
        className={cn("text-sm", className)}
        {...props}
      />
      <p className="mt-1 text-right text-[10px] text-muted-foreground">
        {value.length}/{maxLength}
      </p>
    </div>
  );
}
