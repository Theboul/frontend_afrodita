import { z } from "zod";

// Definimos el esquema de validación con Zod
export const step1UsuarioSchema = z.object({
  nombre_usuario: z
    .string()
    .min(4, "El usuario debe tener al menos 4 caracteres")
    .max(20, "El usuario no puede superar los 20 caracteres")
    .regex(/^[a-zA-Z0-9._-]+$/, "Solo se permiten letras, números, puntos, guiones y guion bajo"),
  
  correo: z.string().email("Correo inválido"),
  
  password: z
    .string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "Debe contener al menos una mayúscula")
    .regex(/[a-z]/, "Debe contener al menos una minúscula")
    .regex(/[0-9]/, "Debe contener al menos un número")
    .regex(/[@$!%*?&]/, "Debe contener al menos un caracter especial (@$!%*?&)"),
  
  confirmPassword: z.string(),
    }).refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
});

export const step2UsuarioSchema = z.object({
  nombre_completo: z
    .string()
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(50, "El nombre no puede superar los 50 caracteres")
    .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "El nombre solo puede contener letras y espacios"),
  telefono: z
    .string()
    .regex(/^[0-9]{8,12}$/, "El teléfono debe tener entre 8 y 12 dígitos")
    .optional(),

  sexo: z.enum(["M", "F", "N"]),
});


export const loginSchema = z.object({
  credencial: z
    .string()
    .min(4, "El usuario debe tener al menos 4 caracteres")
    .nonempty('El usuario o email es requerido'),
  contraseña: z
    .string()
    .nonempty('La contraseña es requerida'),
});


export type LoginFormData = z.infer<typeof loginSchema>;
export const usuarioSchema = step1UsuarioSchema.merge(step2UsuarioSchema);
export type UsuarioRegistro = z.infer<typeof usuarioSchema>;