import PagePlaceholder from "@/components/admin/PagePlaceholder";
import { FileText } from "lucide-react";

export default function InvoicesPage() {
  return (
    <PagePlaceholder
      title="Invoices"
      description="Generate, view, and send invoices to customers."
      icon={FileText}
    />
  );
}
