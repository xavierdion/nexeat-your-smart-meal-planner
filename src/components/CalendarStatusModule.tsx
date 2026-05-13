import { useState } from "react";
import { Calendar } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CalendarStatusModuleProps {
  email: string;
  isConnected: boolean;
  lastSyncAt?: Date;
  eventsThisWeek?: number;
  nextSyncAt?: Date;
  onDisconnect: () => void;
}

const formatRelativePast = (date: Date) => {
  const diffMin = Math.max(0, Math.round((Date.now() - date.getTime()) / 60000));
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return m === 0 ? `il y a ${h}h` : `il y a ${h}h ${m}min`;
};

const formatRelativeFuture = (date: Date) => {
  const diffMin = Math.max(0, Math.round((date.getTime() - Date.now()) / 60000));
  if (diffMin < 60) return `dans ${diffMin} min`;
  const h = Math.floor(diffMin / 60);
  const m = diffMin % 60;
  return m === 0 ? `dans ${h}h` : `dans ${h}h ${m}min`;
};

const CalendarStatusModule = ({
  email,
  isConnected,
  lastSyncAt,
  eventsThisWeek,
  nextSyncAt,
  onDisconnect,
}: CalendarStatusModuleProps) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleConfirm = () => {
    onDisconnect();
    setConfirmOpen(false);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-eyebrow uppercase text-primary/70">CALENDRIER</p>
        {isConnected && (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/40 px-2.5 py-1 text-xs text-foreground">
            <span className="relative inline-flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[hsl(var(--sage))] opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[hsl(var(--sage))]" />
            </span>
            Connecté
          </span>
        )}
      </div>

      {/* Compte */}
      <div className="mt-3 flex items-center gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--sage))]/30">
          <Calendar size={18} className="text-[hsl(var(--sage))]" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-wide text-[hsl(var(--text-subtle))]">
            Google Calendar
          </p>
          <p className="truncate text-[14px] text-foreground">{email}</p>
        </div>
      </div>

      {/* Métriques */}
      <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
        <div className="min-w-0">
          <div className="font-display text-display-md text-primary tabular-nums">
            {eventsThisWeek ?? 0}
          </div>
          <p className="mt-1 text-[11px] leading-tight text-[hsl(var(--text-subtle))]">
            events cette semaine
          </p>
        </div>
        <div className="min-w-0">
          <div className="font-display text-display-md text-primary tabular-nums">↺</div>
          <p className="mt-1 text-[11px] leading-tight text-[hsl(var(--text-subtle))]">
            Dernière sync
            <br />
            {lastSyncAt ? formatRelativePast(lastSyncAt) : "—"}
          </p>
        </div>
        <div className="min-w-0">
          <div className="font-display text-display-md text-primary tabular-nums">→</div>
          <p className="mt-1 text-[11px] leading-tight text-[hsl(var(--text-subtle))]">
            Prochaine sync
            <br />
            {nextSyncAt ? formatRelativeFuture(nextSyncAt) : "—"}
          </p>
        </div>
      </div>

      {/* Footer action */}
      <div className="mt-4 flex justify-end">
        <button
          type="button"
          onClick={() => setConfirmOpen(true)}
          className="px-3 h-9 rounded-lg border-[1.5px] border-destructive text-[13px] text-destructive font-medium"
        >
          Déconnecter
        </button>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-[340px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-display-md text-foreground">
              Déconnecter Google Calendar ?
            </DialogTitle>
            <DialogDescription className="text-[13px] text-foreground/70 leading-relaxed">
              NexEat ne pourra plus lire ton horaire. Les suggestions deviendront génériques jusqu'à ce que tu reconnectes.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 flex-row justify-end gap-2 sm:justify-end">
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="px-4 h-10 rounded-lg border-[1.5px] border-border text-[14px] text-foreground font-medium"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="px-4 h-10 rounded-lg border-[1.5px] border-destructive bg-destructive text-destructive-foreground text-[14px] font-medium"
            >
              Déconnecter
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CalendarStatusModule;