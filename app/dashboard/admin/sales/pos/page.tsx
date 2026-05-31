import PagePlaceholder from "@/components/admin/PagePlaceholder";
import { Monitor } from "lucide-react";

export default function POSPage() {
  return (
    <PagePlaceholder
      title="POS Terminal"
      description="Fast in-store billing with QR scan support and real-time stock updates."
      icon={Monitor}
    />
  );
}
