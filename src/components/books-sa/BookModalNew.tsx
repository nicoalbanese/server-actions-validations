import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

export default function BookModal({
  title,
  open,
  setOpen,
  children,
}: {
  title?: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
}) {
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogContent>
        <DialogHeader className="px-5 pt-5">
          <DialogTitle>{title ?? "Mutate"}</DialogTitle>
        </DialogHeader>
        <div className="px-5 pb-5">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
