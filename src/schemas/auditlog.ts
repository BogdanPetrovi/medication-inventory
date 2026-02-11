import { EntityTypes } from '@prisma/client'
import { z } from 'zod'

export const EntityType = z.enum(
    Object.values(EntityTypes) as [EntityTypes, ...EntityTypes[]]
)