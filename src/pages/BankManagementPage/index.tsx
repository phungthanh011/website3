import { GenericEntityPage } from "@/lib/generic/GenericEntityPage"
import { bankEntityConfig } from "./bankEntityConfig"

export default function BankManagementPage() {
  return <GenericEntityPage config={bankEntityConfig} />
}
