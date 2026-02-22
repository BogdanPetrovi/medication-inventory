import { describe, expect, test, vi } from 'vitest'
import Request from 'supertest'
import prisma from '../src/services/prisma/__mocks__/prisma.js'

vi.mock('../src/services/prisma/prisma.js')

import app from '../src/index.js'
import { setUpDefaultTransactionMocks } from './utils/helperFunctions.js'
import { mockUserTransactionBody } from './utils/mockData.js'

describe("Stock calculations", () => {
  test('When type is CHECKOUT', async () => {
    setUpDefaultTransactionMocks()

    const result = await Request(app).post('/api/transactions').send(mockUserTransactionBody)

    expect(result.status).toBe(201)
    expect(prisma.medication.updateMany).toHaveBeenCalledWith({
      where: { id: mockUserTransactionBody.medicationId, currentStockQuantity: { gte: mockUserTransactionBody.quantity } },
      data: {
        currentStockQuantity: { decrement: mockUserTransactionBody.quantity }
      }
    })
  })

  test('When type is RETURN', async () => {
    setUpDefaultTransactionMocks()

    const result = await Request(app).post('/api/transactions').send({...mockUserTransactionBody, type: "RETURN"})

    expect(result.status).toBe(201)
    expect(prisma.medication.update).toHaveBeenCalledWith({
      where: { id: mockUserTransactionBody.medicationId },
      data: {
        currentStockQuantity: { increment: mockUserTransactionBody.quantity }
      }
    })
  })

  test('When type is WASTE', async () => {
    setUpDefaultTransactionMocks()

    const result = await Request(app).post('/api/transactions').send({...mockUserTransactionBody, type: "WASTE", notes: "This are the notes"})

    expect(result.status).toBe(201)
    expect(prisma.medication.updateMany).not.toHaveBeenCalled()
    expect(prisma.medication.update).not.toHaveBeenCalled()
  })
  
})