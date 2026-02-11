import { describe, expect, test, vi } from 'vitest'
import Request from 'supertest'
import prisma from '../src/services/prisma/__mocks__/prisma.js'

vi.mock('../src/services/prisma/prisma.js')

import app from '../src/index.js'
import { setUpDefaultTransactionMocks } from './utils/helperFunctions.js'
import { mockedNurse, mockedWitness, mockUserTransactionBody } from './utils/mockData.js'

describe("Create transaction", () => {
  test('Successful case', async () => {
    setUpDefaultTransactionMocks()

    const result = await Request(app).post('/api/transactions').send(mockUserTransactionBody)
  
    expect(result.status).toBe(201)
    expect(result.body.message).toEqual("Successfully created transaction")
  })

  test('Failure: Nurse and witness IDs are the same', async () => {
    setUpDefaultTransactionMocks()

    const result = await Request(app).post('/api/transactions').send({
      ...mockUserTransactionBody,
      witnessId: 2
    })

    expect(result.status).toBe(400)
    expect(result.body.message).toEqual("Nurse id and witness id has to be different")
  })

  test('Failure: Medication not found', async () => {
    setUpDefaultTransactionMocks()
    prisma.medication.findUnique.mockResolvedValue(null)

    const result = await Request(app).post('/api/transactions').send(mockUserTransactionBody)

    expect(result.status).toBe(404)
    expect(result.body.message).toEqual("Medication not found")
  })

  test('Failure: Not enough quantity in stock', async () => {
    setUpDefaultTransactionMocks()

    const result = await Request(app).post('/api/transactions').send({
      ...mockUserTransactionBody,
      quantity: 5000
    })

    expect(result.status).toBe(409)
    expect(result.body.message).toEqual("There is not enough quantity in stock") 
  })

  test('Failure: Wrong nurse id', async () => {
    prisma.user.findUnique.mockResolvedValueOnce({...mockedNurse, role: "WITNESS"}).mockResolvedValueOnce(mockedWitness)

    const result = await Request(app).post('/api/transactions').send(mockUserTransactionBody)

    expect(result.status).toBe(400)
    expect(result.body.message).toEqual("The nurse ID provided does not belong to a nurse") 
  })
})