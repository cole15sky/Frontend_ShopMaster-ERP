import PagePlaceholder from "@/components/admin/PagePlaceholder";
import { History } from "lucide-react";

export default function QRHistoryPage() {
  return (
    <PagePlaceholder
      title="QR Scan History"
      description="Track all QR code scan events with timestamps and variant details."
      icon={History}
    />
  );
}
