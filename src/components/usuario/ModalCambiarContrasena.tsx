import { useState } from 'react';
import Button from '../ui/Button';
import type { Usuario } from '../../services/usuarios/gestionUsuario';

interface ModalCambiarContrasenaProps {
  show: boolean;
  usuario: Usuario;
  onConfirm: (nuevaContrasena: string) => Promise<boolean>;
  onCancel: () => void;
}

export default function ModalCambiarContrasena({
  show,
  usuario,
  onConfirm,
  onCancel
}: ModalCambiarContrasenaProps) {
  const [loading, setLoading] = useState(false);
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [errores, setErrores] = useState<{ [key: string]: string }>({});

  const validarContrasena = (password: string) => {
    const errores: string[] = [];
    if (password.length < 8) errores.push('Mínimo 8 caracteres');
    if (!/(?=.*[A-Z])/.test(password)) errores.push('Al menos 1 mayúscula');
    if (!/(?=.*[0-9])/.test(password)) errores.push('Al menos 1 número');
    return errores;
  };

  const handleConfirm = async () => {
    const nuevosErrores: { [key: string]: string } = {};

    // Validaciones
    const erroresContrasena = validarContrasena(contrasena);
    if (erroresContrasena.length > 0) {
      nuevosErrores.contrasena = erroresContrasena.join(', ');
    }

    if (contrasena !== confirmarContrasena) {
      nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setLoading(true);
    const success = await onConfirm(contrasena);
    if (success) {
      setContrasena('');
      setConfirmarContrasena('');
      setErrores({});
    }
    setLoading(false);
  };

  const getFortalezaContrasena = (password: string) => {
    if (password.length === 0) return { texto: '', color: '' };
    if (password.length < 8) return { texto: 'Débil', color: 'text-red-500' };
    
    const tieneMayuscula = /(?=.*[A-Z])/.test(password);
    const tieneNumero = /(?=.*[0-9])/.test(password);
    
    if (tieneMayuscula && tieneNumero) return { texto: 'Fuerte', color: 'text-green-500' };
    if (tieneMayuscula || tieneNumero) return { texto: 'Media', color: 'text-yellow-500' };
    
    return { texto: 'Débil', color: 'text-red-500' };
  };

  const fortaleza = getFortalezaContrasena(contrasena);

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Cambiar Contraseña
        </h3>
        
        <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded">
          <p className="font-medium text-sm sm:text-base">{usuario.nombre_completo}</p>
          <p className="text-xs sm:text-sm text-gray-600">@{usuario.nombre_usuario}</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Nueva Contraseña
            </label>
            <input
              type="password"
              value={contrasena}
              onChange={(e) => {
                setContrasena(e.target.value);
                setErrores(prev => ({ ...prev, contrasena: '' }));
              }}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ingresa nueva contraseña"
            />
            {contrasena && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs text-gray-500">Fortaleza: <span className={fortaleza.color}>{fortaleza.texto}</span></span>
                <ul className="text-xs text-gray-500 flex space-x-2">
                  <li className={contrasena.length >= 8 ? 'text-green-500' : 'text-gray-300'}>8+ chars</li>
                  <li className={/(?=.*[A-Z])/.test(contrasena) ? 'text-green-500' : 'text-gray-300'}>A-Z</li>
                  <li className={/(?=.*[0-9])/.test(contrasena) ? 'text-green-500' : 'text-gray-300'}>0-9</li>
                </ul>
              </div>
            )}
            {errores.contrasena && (
              <p className="text-red-500 text-xs mt-1">{errores.contrasena}</p>
            )}
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              value={confirmarContrasena}
              onChange={(e) => {
                setConfirmarContrasena(e.target.value);
                setErrores(prev => ({ ...prev, confirmarContrasena: '' }));
              }}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Confirma la contraseña"
            />
            {errores.confirmarContrasena && (
              <p className="text-red-500 text-xs mt-1">{errores.confirmarContrasena}</p>
            )}
          </div>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
          <p className="text-xs sm:text-sm text-blue-800">
            📧 El usuario será notificado del cambio de contraseña.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 sm:mt-6">
          <Button
            label="Cancelar"
            color="info"
            onClick={onCancel}
            disabled={loading}
          />
          <Button
            label={loading ? "Cambiando..." : "Cambiar Contraseña"}
            color="warning"
            onClick={handleConfirm}
            disabled={loading || !contrasena || !confirmarContrasena}
          />
        </div>
      </div>
    </div>
  );
}