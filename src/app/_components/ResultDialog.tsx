import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from "@yamada-ui/react";

interface ResultDialogProps {
  isOpen: boolean;
  type: "success" | "error";
  title: string;
  message: string;
  onClose: () => void;
}
export const ResultDialog: React.FC<ResultDialogProps> = ({
  isOpen,
  type,
  title,
  message,
  onClose,
}) => {
  const headerBg = type === "success" ? "primary" : "#ff8c93";
  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogHeader bg={headerBg} color="white" fontWeight="bold" pb={2}>
        {title}
      </DialogHeader>
      <DialogBody>{message}</DialogBody>
      <DialogFooter>
        <Button
          onClick={onClose}
          colorScheme={type === "success" ? "primary" : "warning"}
        >
          OK
        </Button>
      </DialogFooter>
    </Dialog>
  );
};
