import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  step1UsuarioSchema,
  step2UsuarioSchema,
} from "../../validation/usuarioSchema";
import { z } from "zod";

type Step1Data = z.infer<typeof step1UsuarioSchema>;
type Step2Data = z.infer<typeof step2UsuarioSchema>;

type UsuarioFormProps =
  | { step: 1; onSubmit: (data: Step1Data) => Promise<void>; loading?: boolean }
  | { step: 2; onSubmit: (data: Step2Data) => Promise<void>; loading?: boolean };

// 🔹 Componente auxiliar para no repetir estructura
const FormField = ({
  name,
  type = "text",
  placeholder,
  register,
  error,
}: {
  name: string;
  type?: string;
  placeholder: string;
  register: any;
  error?: string;
}) => (
  <div>
    <input
      type={type}
      placeholder={placeholder}
      {...register(name)}
      className="input-base"
    />
    {error && <p className="error">{error}</p>}
  </div>
);

export default function UsuarioForm(props: UsuarioFormProps) {
  const schema = props.step === 1 ? step1UsuarioSchema : step2UsuarioSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
  });

  // Definición de campos por paso
  const step1Fields = [
    { name: "nombre_usuario", type: "text", placeholder: "Nombre de usuario" },
    { name: "correo", type: "email", placeholder: "Correo electrónico" },
    { name: "password", type: "password", placeholder: "Contraseña" },
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirmar contraseña",
    },
  ];

  const step2Fields = [
    { name: "nombre_completo", type: "text", placeholder: "Nombre completo" },
    { name: "telefono", type: "tel", placeholder: "Teléfono (opcional)" },
  ];

  // Render
  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="space-y-4" noValidate>
      {(props.step === 1 ? step1Fields : step2Fields).map((field) => (
        <FormField
          key={field.name}
          {...field}
          register={register}
          error={errors[field.name]?.message as string}
        />
      ))}

      {/* Campo select solo para paso 2 */}
      {props.step === 2 && (
        <div>
          <select {...register("sexo")} className="input-base">
            <option value="M">Masculino</option>
            <option value="F">Femenino</option>
            <option value="N">Prefiero no decirlo</option>
          </select>
          {errors.sexo && (
            <p className=".error">{errors.sexo?.message as string}</p>
          )}
        </div>
      )}

      {/* Botón */}
      <button
        type="submit"
        disabled={isSubmitting || props.loading}
        className="btn bg-purple-600 hover:bg-[#9533d6] text-white font-semibold px-4 py-2 rounded-md shadow-md transition duration-300"
      >
        {isSubmitting || props.loading
          ? "Procesando..."
          : props.step === 1
          ? "Siguiente"
          : "Registrarse"}
      </button>
    </form>
  );
}
