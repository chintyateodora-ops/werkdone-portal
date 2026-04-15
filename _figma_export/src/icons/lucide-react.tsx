import * as React from "react";
import { cn } from "@/components/ui/utils";

export type LucideCompatProps = React.ComponentPropsWithoutRef<"span"> & {
  size?: number | string;
};

function makeIcon(fiClass: string, displayName: string) {
  const Icon = React.forwardRef<HTMLSpanElement, LucideCompatProps>(function Icon(
    { className, size, style, "aria-hidden": ariaHidden, ...props },
    ref
  ) {
    const px = size !== undefined ? (typeof size === "number" ? `${size}px` : size) : undefined;
    return (
      <span
        ref={ref}
        aria-hidden={ariaHidden ?? true}
        className={cn(
          "inline-flex shrink-0 items-center justify-center leading-none [&>i]:block",
          !px && "text-base",
          className
        )}
        style={px ? { width: px, height: px, fontSize: px, lineHeight: 1, ...style } : style}
        {...props}
      >
        <i className={cn("fi", fiClass)} style={{ fontSize: "1em", width: "1em", height: "1em", lineHeight: 1 }} />
      </span>
    );
  });
  Icon.displayName = displayName;
  return Icon;
}

/* —— Flaticon Uicons (regular rounded, fi-rr-*) —— */

export const ChevronLeft = makeIcon("fi-rr-angle-small-left", "ChevronLeft");
export const ChevronRight = makeIcon("fi-rr-angle-small-right", "ChevronRight");
export const ChevronDown = makeIcon("fi-rr-angle-small-down", "ChevronDown");
export const ChevronUp = makeIcon("fi-rr-angle-small-up", "ChevronUp");
export const Search = makeIcon("fi-rr-search", "Search");
export const X = makeIcon("fi-rr-cross-small", "X");
export const Plus = makeIcon("fi-rr-plus", "Plus");
export const Trash2 = makeIcon("fi-rr-trash", "Trash2");
export const Pencil = makeIcon("fi-rr-pencil", "Pencil");
export const ArrowLeft = makeIcon("fi-rr-arrow-left", "ArrowLeft");
export const ArrowRight = makeIcon("fi-rr-arrow-right", "ArrowRight");
export const Phone = makeIcon("fi-rr-phone-call", "Phone");
export const Mail = makeIcon("fi-rr-envelope", "Mail");
export const Calendar = makeIcon("fi-rr-calendar", "Calendar");
export const CalendarDays = makeIcon("fi-rr-calendar-lines", "CalendarDays");
export const User = makeIcon("fi-rr-user", "User");
export const UserRound = makeIcon("fi-rr-user", "UserRound");
export const Check = makeIcon("fi-rr-check", "Check");
export const MoreHorizontal = makeIcon("fi-rr-menu-dots", "MoreHorizontal");
export const FileText = makeIcon("fi-rr-document", "FileText");
export const Clock = makeIcon("fi-rr-clock", "Clock");
export const AlertCircle = makeIcon("fi-rr-exclamation", "AlertCircle");
export const Copy = makeIcon("fi-rr-copy", "Copy");
export const RefreshCw = makeIcon("fi-rr-refresh", "RefreshCw");
export const Edit2 = makeIcon("fi-rr-edit", "Edit2");
export const Upload = makeIcon("fi-rr-upload", "Upload");
export const Download = makeIcon("fi-rr-download", "Download");
export const Filter = makeIcon("fi-rr-filter", "Filter");
export const Columns = makeIcon("fi-rr-table-columns", "Columns");
export const ArrowUpDown = makeIcon("fi-rr-sort-alt", "ArrowUpDown");
export const Tag = makeIcon("fi-rr-label", "Tag");
export const UserPlus = makeIcon("fi-rr-user-add", "UserPlus");
export const MessageSquare = makeIcon("fi-rr-comment", "MessageSquare");
export const MessageSquareText = makeIcon("fi-rr-comment-alt", "MessageSquareText");
export const Eye = makeIcon("fi-rr-eye", "Eye");
export const Link2 = makeIcon("fi-rr-link", "Link2");
export const CheckCircle2 = makeIcon("fi-rr-check-circle", "CheckCircle2");
export const CheckCircle = makeIcon("fi-rr-check-circle", "CheckCircle");
export const BadgeCheck = makeIcon("fi-rr-badge-check", "BadgeCheck");
export const List = makeIcon("fi-rr-list", "List");
export const LayoutGrid = makeIcon("fi-rr-apps", "LayoutGrid");
export const Circle = makeIcon("fi-rr-circle", "Circle");
export const Lock = makeIcon("fi-rr-lock", "Lock");
export const Settings = makeIcon("fi-rr-settings", "Settings");
export const HelpCircle = makeIcon("fi-rr-interrogation", "HelpCircle");
export const Menu = makeIcon("fi-rr-menu-burger", "Menu");
export const Archive = makeIcon("fi-rr-archive", "Archive");
export const Star = makeIcon("fi-rr-star", "Star");
export const MoreVertical = makeIcon("fi-rr-menu-dots-vertical", "MoreVertical");
export const Home = makeIcon("fi-rr-home", "Home");
export const Users = makeIcon("fi-rr-users", "Users");
export const Briefcase = makeIcon("fi-rr-briefcase", "Briefcase");
export const Heart = makeIcon("fi-rr-heart", "Heart");
export const ClipboardList = makeIcon("fi-rr-list-check", "ClipboardList");
export const TestTube2 = makeIcon("fi-rr-flask", "TestTube2");
export const Syringe = makeIcon("fi-rr-syringe", "Syringe");
export const Microscope = makeIcon("fi-rr-microscope", "Microscope");
export const BarChart3 = makeIcon("fi-rr-chart-histogram", "BarChart3");
export const Shield = makeIcon("fi-rr-shield", "Shield");
/** Used like Lucide `ShieldAlert` in prospect / screening headers */
export const ShieldAlert = makeIcon("fi-rr-shield-exclamation", "ShieldAlert");
export const History = makeIcon("fi-rr-time-past", "History");
export const Clipboard = makeIcon("fi-rr-clipboard", "Clipboard");
export const Minus = makeIcon("fi-rr-minus", "Minus");

/** Sidebar: was PanelLeft in Lucide */
export const PanelLeft = makeIcon("fi-rr-sidebar", "PanelLeft");

/* Radix / shadcn “Icon” suffix — same visuals, stable names */
export const ChevronDownIcon = ChevronDown;
export const ChevronUpIcon = ChevronUp;
export const ChevronLeftIcon = ChevronLeft;
export const ChevronRightIcon = ChevronRight;
export const CheckIcon = Check;
/** Menu / radio bullet — small circle */
export const CircleIcon = makeIcon("fi-rr-circle-small", "CircleIcon");
export const XIcon = X;
export const SearchIcon = Search;
export const PanelLeftIcon = PanelLeft;
export const MinusIcon = Minus;
export const GripVerticalIcon = makeIcon("fi-rr-grip-dots-vertical", "GripVerticalIcon");
export const MoreHorizontalIcon = MoreHorizontal;

export { Home as HomeIcon };
