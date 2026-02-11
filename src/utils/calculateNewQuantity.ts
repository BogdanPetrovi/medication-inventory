type CalculateNewQuantityParams = {
  type: string,
  quantity: number,
  currentQuantity: number
}

const calculateNewQuantity = ({ type, quantity, currentQuantity}: CalculateNewQuantityParams): number => {
    if(type === "CHECKOUT")
        return currentQuantity - quantity

    if(type === "RETURN")
        return currentQuantity + quantity

    return currentQuantity
}

export default calculateNewQuantity
