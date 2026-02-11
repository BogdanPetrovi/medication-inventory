import prisma from "../src/services/prisma/prisma.js"

async function main () {
    const addUsers = await prisma.user.createMany({
    data: [
        {
            email: 'bob@email.com',
            name: 'Bob',
            role: 'ADMIN'
        },
        {
            email: 'mike@email.com',
            name: 'Mike',
            role: 'WITNESS'
        },
        {
            email: 'alice@email.com',
            name: 'Alice',
            role: 'NURSE'
        }
    ]
    })

    const addMedications = await prisma.medication.createMany({
    data: [
        {
            name: 'Oxycodone',
            schedule: 'II',
            unit: 'mg',
            currentStockQuantity: 150
        },
        {
            name: 'Buprenorphine',
            schedule: 'III',
            unit: 'mg',
            currentStockQuantity: 80
        },
        {
            name: 'Ketamine',
            schedule: 'III',
            unit: 'ml',
            currentStockQuantity: 60
        },
        {
            name: 'Alprazolam',
            schedule: 'IV',
            unit: 'mcg',
            currentStockQuantity: 500
        },
        {
            name: 'Codeine Syrup',
            schedule: 'V',
            unit: 'ml',
            currentStockQuantity: 120
        },
    ]
    })

    console.log("Added users: " + addUsers.count)
    console.log("Added medications: " + addMedications.count)
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })