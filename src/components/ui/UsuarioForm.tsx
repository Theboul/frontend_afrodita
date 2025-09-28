import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { step1UsuarioSchema, step2UsuarioSchema,} from "../../validation/usuarioSchema";
import { z } from "zod";


type Step1Data = z.infer<typeof step1UsuarioSchema>;
type Step2Data = z.infer<typeof step2UsuarioSchema>;

type UsuarioFormProps =
  | { step: 1; onSubmit: (data: Step1Data) => Promise<void>; loading?: boolean }
  | { step: 2; onSubmit: (data: Step2Data) => Promise<void>; loading?: boolean };

export default function UsuarioForm(props: UsuarioFormProps) {
  // Elegir el schema según el paso
  const schema = props.step === 1 ? step1UsuarioSchema : step2UsuarioSchema;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<any>({
    resolver: zodResolver(schema),
  });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className="space-y-4" noValidate>
      {/* === PASO 1 === */}
      {props.step === 1 && (
        <>
          <div>
            <input
              type="text"
              placeholder="Nombre de usuario"
              {...register("nombre_usuario")}
              className="input"
            />
            {errors.nombre_usuario && (
              <p className="error">{errors.nombre_usuario?.message as string}</p>
            )}
          </div>

          <div>
            <input
              type="email"
              placeholder="Correo electrónico"
              {...register("correo")}
              className="input"
            />
            {errors.correo && <p className="error">{errors.correo?.message as string}</p>}
          </div>

          <div>
            <input
              type="password"
              placeholder="Contraseña"
              {...register("password")}
              className="input"
            />
            {errors.password && (
              <p className="error">{errors.password?.message as string}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              {...register("confirmPassword")}
              className="input"
            />
            {errors.confirmPassword && (
              <p className="error">{errors.confirmPassword?.message as string}</p>
            )}
          </div>
        </>
      )}

      {/* === PASO 2 === */}
      {props.step === 2 && (
        <>
          <div>
            <input
              type="text"
              placeholder="Nombre completo"
              {...register("nombre_completo")}
              className="input"
            />
            {errors.nombre_completo && (
              <p className="error">{errors.nombre_completo?.message as string}</p>
            )}
          </div>

          <div>
            <input
              type="tel"
              placeholder="Teléfono (opcional)"
              {...register("telefono")}
              className="input"
            />
            {errors.telefono && (
              <p className="error">{errors.telefono?.message as string}</p>
            )}
          </div>

          <div>
            <select {...register("sexo")} className="input">
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="N">Prefiero no decirlo</option>
            </select>
            {errors.sexo && <p className="error">{errors.sexo?.message as string}</p>}
          </div>

          <div>
            <input
              type="text"
              placeholder="Dirección"
              {...register("direccion")}
              className="input"
            />
            {errors.direccion && (
              <p className="error">{errors.direccion?.message as string}</p>
            )}
          </div>
        </>
      )}

      {/* Botón */}
      <button
        type="submit"
        disabled={isSubmitting || props.loading}
        className="btn"
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