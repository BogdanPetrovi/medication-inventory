import { describe, expect, test, vi } from 'vitest'
import Request from 'supertest'

vi.mock('../src/services/prisma/prisma.js')

import app from '../src/index.js'
import { setUpDefaultTransactionMocks } from './utils/helperFunctions.js'
import { mockUserTransactionBody } from './utils/mockData.js'

describe("Input validations", () => {
  describe("Medications routes", () => {
    test("Wrong schedule type", async () => {
      const result = await Request(app).get("/api/medications?schedule=I")

      expect(result.status).toBe(400)
    })

    test("Get single medication wrong params type (string)", async () => {
      const result = await Request(app).get("/api/medications/string")

      expect(result.status).toBe(400)
    })
  })

  describe("Transactions routes", () => {
    test("Missing rows in body", async () => {
      setUpDefaultTransactionMocks()

      const result = await Request(app).post("/api/transactions").send({ medicationId: 2, nurseId: 3, quantity: 30 })

      expect(result.status).toBe(400)
    })

    test("Wrong type of medicationId", async () => {
      setUpDefaultTransactionMocks()

      const result = await Request(app).post("/api/transactions").send({ ...mockUserTransactionBody, medicationId: "1" })
    
      expect(result.status).toBe(400)
    })

    test("Wrong type of nurseId", async () => {
      setUpDefaultTransactionMocks()

      const result = await Request(app).post("/api/transactions").send({ ...mockUserTransactionBody, nurseId: "2" })
    
      expect(result.status).toBe(400)
    })
    
    test("Wrong type of witnessId", async () => {
      setUpDefaultTransactionMocks()

      const result = await Request(app).post("/api/transactions").send({ ...mockUserTransactionBody, witnessId: "3" })
    
      expect(result.status).toBe(400)
    })

    test("Wrong type of type", async () => {
      setUpDefaultTransactionMocks()

      const result = await Request(app).post("/api/transactions").send({ ...mockUserTransactionBody, type: "FINISHED" })
    
      expect(result.status).toBe(400)
    })

    test("Wrong type of quantity", async () => {
      setUpDefaultTransactionMocks()

      const result = await Request(app).post("/api/transactions").send({ ...mockUserTransactionBody, quantity: "30" })
    
      expect(result.status).toBe(400)
    })
    
    test("Wrong type of notes", async () => {
      setUpDefaultTransactionMocks()

      const result = await Request(app).post("/api/transactions").send({ ...mockUserTransactionBody, notes: 23 })
    
      expect(result.status).toBe(400)
    })

    test("Wrong type of type in getTransactions", async () => {
      const result = await Request(app).get("/api/transactions?type=FINISHED")

      expect(result.status).toBe(400)
    })

    test("Wrong type of medicationId in getTransactions", async () => {
      const result = await Request(app).get("/api/transactions?medicationId=three")

      expect(result.status).toBe(400)
    })
  })

  describe("Audit log routes", () => {
    test("Wrong entity type", async () => {
      const result = await Request(app).get("/api/audit-log?entityType=RANDOM")

      expect(result.status).toBe(400)
    })
  })
})