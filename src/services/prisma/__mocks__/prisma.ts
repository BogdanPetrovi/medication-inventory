import { PrismaClient } from '../../../generated/prisma/client.js'
import { beforeEach } from 'vitest'
import { mockDeep, mockReset } from 'vitest-mock-extended'

const prisma = mockDeep<PrismaClient>()

beforeEach(() => {
  mockReset(prisma)
})

export default prisma