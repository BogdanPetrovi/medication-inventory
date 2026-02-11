import { EntityTypes } from '../generated/prisma/client.js'
import { z } from 'zod'

export const EntityType = z.enum(
    Object.values(EntityTypes) as [EntityTypes, ...EntityTypes[]]
)