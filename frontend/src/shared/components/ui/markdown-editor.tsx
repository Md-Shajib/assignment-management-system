"use client";

import { useRef } from "react";
import { Bold, Italic, Link, List, ListOrdered, Underline, type LucideIcon } from "lucide-react";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils/cn";
import { applyMarkdownFormat, type MarkdownFormat } from "@/shared/utils/markdown";

interface ToolbarAction {
  format: MarkdownFormat;
  icon: LucideIcon;
  label: string;
  /** Starts a new button group in the toolbar. */
  startsGroup?: boolean;
}

const TOOLBAR_ACTIONS: ToolbarAction[] = [
  { format: "bold", icon: Bold, label: "Bold" },
  { format: "italic", icon: Italic, label: "Italic" },
  { format: "underline", icon: Underline, label: "Underline" },
  { format: "bulletList", icon: List, label: "Bulleted list", startsGroup: true },
  { format: "numberedList", icon: ListOrdered, label: "Numbered list" },
  { format: "link", icon: Link, label: "Link", startsGroup: true },
];

export interface MarkdownEditorProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  name: string;
  /** React Hook Form always hands down a callback ref, so the field stays registered. */
  fieldRef: (instance: HTMLTextAreaElement | null) => void;
  invalid: boolean;
  describedBy?: string;
  placeholder?: string;
}

/**
 * A plain-text field with Markdown shortcuts.
 *
 * The API stores long-form text as a plain string, so the toolbar inserts
 * Markdown rather than pretending to be a rich-text document model.
 */
export function MarkdownEditor({
  id,
  value,
  onChange,
  onBlur,
  name,
  fieldRef,
  invalid,
  describedBy,
  placeholder,
}: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const runFormat = (format: MarkdownFormat) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      return;
    }

    const edit = applyMarkdownFormat(value, textarea.selectionStart, textarea.selectionEnd, format);
    onChange(edit.value);

    // The caret is restored after React has written the new value back.
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(edit.selectionStart, edit.selectionEnd);
    });
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-md border",
        invalid ? "border-error" : "border-outline-variant",
      )}
    >
      <div
        role="toolbar"
        aria-label="Description formatting"
        aria-controls={id}
        className="flex items-center gap-1 border-b border-border-muted bg-surface-container-low px-2 py-1.5"
      >
        {TOOLBAR_ACTIONS.map((action) => (
          <span key={action.format} className="flex items-center">
            {action.startsGroup ? (
              <span aria-hidden className="mx-1 h-4 w-px bg-outline-variant" />
            ) : null}
            <button
              type="button"
              title={action.label}
              aria-label={action.label}
              onClick={() => runFormat(action.format)}
              className="flex h-7 w-7 items-center justify-center rounded-sm text-on-surface-variant transition-colors hover:bg-surface-container-high focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
            >
              <action.icon className="h-4 w-4" aria-hidden />
            </button>
          </span>
        ))}
      </div>

      <Textarea
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        ref={(node) => {
          textareaRef.current = node;
          fieldRef(node);
        }}
        invalid={invalid}
        aria-describedby={describedBy}
        placeholder={placeholder}
        rows={7}
        className="rounded-none border-0 focus:ring-0"
      />
    </div>
  );
}
