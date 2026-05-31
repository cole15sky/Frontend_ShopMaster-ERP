import PagePlaceholder from "@/components/admin/PagePlaceholder";
import { ShoppingCart } from "lucide-react";

export default function SalesPage() {
  return (
    <PagePlaceholder
      title="Sales & Orders"
      description="View, manage, and process all customer orders in one place."
      icon={ShoppingCart}
    />
  );
}
