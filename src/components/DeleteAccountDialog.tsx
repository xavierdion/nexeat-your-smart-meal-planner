import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface DeleteAccountDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const CONFIRM_WORD = "SUPPRIMER";

const DeleteAccountDialog = ({ open, onOpenChange }: DeleteAccountDialogProps) => {
  const [confirmText, setConfirmText] = useState("");
  const canDelete = confirmText === CONFIRM_WORD;

  const handleOpenChange = (v: boolean) => {
    if (!v) setConfirmText("");
    onOpenChange(v);
  };

  const handleDelete = () => {
    console.log("DELETE ACCOUNT TODO - branch Supabase auth");
    setConfirmText("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-[340px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-display-md text-foreground">
            Supprimer mon compte ?
          </DialogTitle>
          <DialogDescription className="text-[13px] text-foreground/70 leading-relaxed">
            Cette action est irréversible. Toutes tes préférences, ton historique, et la connexion à ton calendrier seront définitivement effacés. La suppression peut prendre jusqu'à 30 jours pour être propagée.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2">
          <label className="block text-[12px] text-foreground/70 mb-2">
            Pour confirmer, tape <span className="font-semibold text-destructive">{CONFIRM_WORD}</span> ci-dessous
          </label>
          <Input
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={CONFIRM_WORD}
            autoCapitalize="characters"
            className="h-10"
          />
        </div>

        <DialogFooter className="mt-2 flex-row justify-end gap-2 sm:justify-end">
          <button
            type="button"
            onClick={() => handleOpenChange(false)}
            className="px-4 h-10 rounded-lg border-[1.5px] border-border text-[14px] text-foreground font-medium"
          >
            Annuler
          </button>
          <button
            type="button"
            disabled={!canDelete}
            onClick={handleDelete}
            className="px-4 h-10 rounded-lg border-[1.5px] border-destructive bg-destructive text-destructive-foreground text-[14px] font-medium disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Supprimer définitivement
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteAccountDialog;