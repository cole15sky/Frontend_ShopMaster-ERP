import PagePlaceholder from "@/components/admin/PagePlaceholder";
import { CreditCard } from "lucide-react";

export default function PaymentsPage() {
  return (
    <PagePlaceholder
      title="Payments"
      description="Track revenue, process refunds, and view full payment history."
      icon={CreditCard}
    />
  );
}
