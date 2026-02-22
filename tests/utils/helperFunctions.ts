import { AuditLog } from '../../src/generated/prisma/client.js'
import prisma from '../../src/services/prisma/__mocks__/prisma.js'
import { mockedMedication, mockedNurse, mockedTransaction, mockedUpdatedMedication, mockedWitness } from './mockData.js'

export const setUpDefaultTransactionMocks = () => {
  prisma.user.findUnique.mockResolvedValueOnce(mockedNurse).mockResolvedValueOnce(mockedWitness)
  prisma.medication.findUnique.mockResolvedValue(mockedMedication)
  prisma.medication.updateMany.mockResolvedValue({ count: 1 })
  prisma.medication.update.mockResolvedValue(mockedUpdatedMedication)
  prisma.transaction.create.mockResolvedValue(mockedTransaction)
  prisma.auditLog.create.mockResolvedValue({} as AuditLog)
  
  prisma.$transaction.mockImplementation(async (cb) => {
    return await cb (prisma)
  })
}