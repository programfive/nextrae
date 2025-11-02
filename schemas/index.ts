import { z } from "zod";
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Correo inválido")
    .regex(/@unibeth\.edu\.bo$/i, "Solo se permiten correos @unibeth.edu.bo"),
  password: z.string().min(1, "La contraseña es requerida"),
});

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Correo inválido")
    .regex(/@unibeth\.edu\.bo$/i, "Solo se permiten correos @unibeth.edu.bo"),
});

export const signUpSchema = z
  .object({
    email: z
      .string()
      .min(1, "El correo es requerido")
      .email("Correo inválido")
      .regex(/@unibeth\.edu\.bo$/i, "Solo se permiten correos @unibeth.edu.bo"),
    password: z.string().min(6, "Mínimo 6 caracteres"),
    repeatPassword: z.string().min(6, "Mínimo 6 caracteres"),
  })
  .refine((data) => data.password === data.repeatPassword, {
    path: ["repeatPassword"],
    message: "Las contraseñas no coinciden",
  });
