import { defineConfig } from '@prisma/config'
import 'dotenv/config' // Baris ini akan memaksa sistem membaca file .env

export default defineConfig({
  datasource: {
    // Tanda '!' memastikan ke TypeScript bahwa variabel ini pasti ada
    url: process.env.DATABASE_URL!,
  },
})