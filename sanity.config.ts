import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'



export default defineConfig({
  name: 'default',
  title: 'hotel-management',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID as string,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET as string,

  basePath: "/studio",

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("Contenido")
          .items([
            // 👇 Aquí defines qué documentos quieres mostrar
            S.documentTypeListItem("user").title("Usuarios"),
            S.documentTypeListItem("account").title("Cuentas"),
            S.documentTypeListItem("hotelRoom").title("Habitaciones de Hotel"),
            S.documentTypeListItem("review").title("Reseñas"),

            // ❌ Si no lo agregas aquí, queda oculto en la UI
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
