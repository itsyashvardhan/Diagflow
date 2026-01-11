import { memo } from "react";
import { Message } from "@/types/diagflow";
import { Bot, User, Clock, Loader2, AlertCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface ChatMessageProps {
  message: Message;
}

// Status badge component for queue visualization
function MessageStatusBadge({ status, retryAttempt, estimatedWaitSeconds, queueReason }: {
  status?: Message["status"];
  retryAttempt?: number;
  estimatedWaitSeconds?: number;
  queueReason?: string;
}) {
  if (!status || status === "sent") return null;

  const statusConfig = {
    sending: {
      icon: Loader2,
      text: "Sending...",
      className: "text-primary animate-pulse",
      iconClassName: "animate-spin",
    },
    queued: {
      icon: Clock,
      text: queueReason || (retryAttempt ? `Retrying (${retryAttempt}/3)...` : "Queued"),
      className: "text-amber-400",
      iconClassName: "animate-pulse",
    },
    error: {
      icon: AlertCircle,
      text: "Failed",
      className: "text-destructive",
      iconClassName: "",
    },
  };

  const config = statusConfig[status];
  if (!config) return null;

  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-1.5 text-xs mt-1 px-2 ${config.className}`}>
      <Icon className={`w-3 h-3 ${config.iconClassName}`} />
      <span>{config.text}</span>
      {status === "queued" && estimatedWaitSeconds && estimatedWaitSeconds > 0 && (
        <span className="text-muted-foreground">
          (~{estimatedWaitSeconds}s)
        </span>
      )}
    </div>
  );
}

// Memoized component to prevent re-renders when other messages change
export const ChatMessage = memo(function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  const hasContent = Boolean(message.content && message.content.trim().length > 0);
  const isQueued = message.status === "queued" || message.status === "sending";

  return (
    <div
      className={`flex gap-3 mb-4 animate-slide-in ${isUser ? "flex-row-reverse" : "flex-row"
        }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center ${isUser
          ? "bg-gradient-to-br from-primary to-accent"
          : "glass-panel"
          } ${isQueued ? "opacity-70" : ""}`}
      >
        {isUser ? (
          <User className="w-5 h-5 text-white" />
        ) : (
          <Bot className="w-5 h-5 text-primary" />
        )}
      </div>

      <div
        className={`flex-1 max-w-[80%] ${isUser ? "text-right" : "text-left"
          }`}
      >
        {hasContent && (
          <div
            className={`inline-block px-4 py-3 rounded-2xl transition-opacity ${isUser
              ? "bg-gradient-to-br from-primary to-accent text-white"
              : "glass-panel"
              } ${isQueued ? "opacity-80" : ""}`}
          >
            {isUser ? (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.content}
              </p>
            ) : (
              <div className="prose prose-sm prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-strong:text-primary prose-code:text-accent prose-code:bg-background/50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {message.attachments && message.attachments.length > 0 && (
          <div
            className={`mt-2 flex flex-wrap gap-2 ${isUser ? "justify-end" : "justify-start"
              }`}
          >
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className={`overflow-hidden rounded-lg border border-border/60 bg-background/40 ${isQueued ? "opacity-70" : ""}`}
              >
                <img
                  src={attachment.dataUrl}
                  alt={attachment.name}
                  className="h-24 w-24 object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Status indicator for user messages */}
        {isUser && (
          <MessageStatusBadge
            status={message.status}
            retryAttempt={message.retryAttempt}
            estimatedWaitSeconds={message.estimatedWaitSeconds}
            queueReason={message.queueReason}
          />
        )}

        {message.timestamp && message.status !== "queued" && message.status !== "sending" && (
          <p className="text-xs text-muted-foreground mt-1 px-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </p>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if the message object reference changed
  // This is more efficient for large chat histories
  return (
    prevProps.message.content === nextProps.message.content &&
    prevProps.message.role === nextProps.message.role &&
    prevProps.message.timestamp === nextProps.message.timestamp &&
    prevProps.message.attachments === nextProps.message.attachments &&
    prevProps.message.status === nextProps.message.status &&
    prevProps.message.retryAttempt === nextProps.message.retryAttempt &&
    prevProps.message.estimatedWaitSeconds === nextProps.message.estimatedWaitSeconds &&
    prevProps.message.queueReason === nextProps.message.queueReason
  );
});

