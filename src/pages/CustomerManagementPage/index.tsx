import { GenericEntityPage } from "@/lib/generic/GenericEntityPage"
import { customerEntityConfig } from "./customerEntityConfig"

export default function CustomerManagementPage() {
  return <GenericEntityPage config={customerEntityConfig} />
}