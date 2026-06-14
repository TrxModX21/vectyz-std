import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useRequestPayout } from "@/hooks/use-earnings";
import { Loader2, Wallet } from "lucide-react";

interface PayoutDialogProps {
  withdrawableBalance: number;
}

const PayoutDialog = ({ withdrawableBalance }: PayoutDialogProps) => {
  const [open, setOpen] = useState(false);
  const [amountCredit, setAmountCredit] = useState<string>("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolder, setAccountHolder] = useState("");

  const requestPayout = useRequestPayout();

  const handleRequest = () => {
    const amount = Number(amountCredit);
    if (!amount || amount < 250) return;

    requestPayout.mutate(
      {
        amountCredit: amount,
        bankName,
        accountNumber,
        accountHolder,
      },
      {
        onSuccess: () => {
          setOpen(false);
          // Reset form
          setAmountCredit("");
          setBankName("");
          setAccountNumber("");
          setAccountHolder("");
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Wallet className="w-4 h-4 mr-2" /> Request Payout
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Request Payout</DialogTitle>
          <DialogDescription>
            Withdraw your earnings to your bank account. Minimum payout is 250
            Credits (≈ Rp 250.000).
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="amount">Amount (Credits)</Label>
            <Input
              id="amount"
              type="number"
              min={250}
              max={withdrawableBalance}
              value={amountCredit}
              onChange={(e) => setAmountCredit(e.target.value)}
              placeholder="e.g. 500"
            />
            <p className="text-xs text-muted-foreground">
              Available balance: {withdrawableBalance.toFixed(2)} Credits
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bank">Bank Name</Label>
            <Input
              id="bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="e.g. BCA, Mandiri, PayPal"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="account">Account Number / Email</Label>
            <Input
              id="account"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="e.g. 1234567890"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="holder">Account Holder Name</Label>
            <Input
              id="holder"
              value={accountHolder}
              onChange={(e) => setAccountHolder(e.target.value)}
              placeholder="e.g. John Doe"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            type="submit"
            disabled={
              !amountCredit ||
              Number(amountCredit) < 250 ||
              Number(amountCredit) > withdrawableBalance ||
              !bankName ||
              !accountNumber ||
              !accountHolder ||
              requestPayout.isPending
            }
            onClick={handleRequest}
          >
            {requestPayout.isPending && (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            )}
            Confirm Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PayoutDialog;
