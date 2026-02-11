import { Transaction, Medication } from "@prisma/client"

type CalculateNewQuantityParams = {
  transactionData: Pick<Transaction, "type" | "quantity">
  medication: Pick<Medication, "currentStockQuantity">
}

const calculateNewQuantity = ({ transactionData, medication,}: CalculateNewQuantityParams): number => {
    if(transactionData.type === "CHECKOUT")
        return medication.currentStockQuantity - transactionData.quantity

    if(transactionData.type === "RETURN")
        return medication.currentStockQuantity + transactionData.quantity

    return medication.currentStockQuantity
}

export default calculateNewQuantity
