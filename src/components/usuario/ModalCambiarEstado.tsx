import { useState } from 'react';
import Button from '../ui/Button';
import type { Usuario } from '../../services/usuarios/gestionUsuario';

interface ModalCambiarEstadoProps {
  show: boolean;
  usuario: Usuario;
  onConfirm: (nuevoEstado: string, motivo?: string) => Promise<boolean>;
  onCancel: () => void;
}

export default function ModalCambiarEstado({
  show,
  usuario,
  onConfirm,
  onCancel
}: ModalCambiarEstadoProps) {
  const [loading, setLoading] = useState(false);
  const [motivo, setMotivo] = useState('');
  
  const nuevoEstado = usuario.estado_usuario === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';

  const handleConfirm = async () => {
    setLoading(true);
    const success = await onConfirm(nuevoEstado, motivo.trim() || undefined);
    if (success) {
      setMotivo('');
    }
    setLoading(false);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
          Cambiar Estado de Usuario
        </h3>
        
        <div className="mb-4 p-3 sm:p-4 bg-gray-50 rounded">
          <p className="font-medium text-sm sm:text-base">{usuario.nombre_completo}</p>
          <p className="text-xs sm:text-sm text-gray-600">@{usuario.nombre_usuario} • {usuario.rol}</p>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs sm:text-sm font-medium">Estado actual:</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              usuario.estado_usuario === 'ACTIVO' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {usuario.estado_usuario}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs sm:text-sm font-medium">Nuevo estado:</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              nuevoEstado === 'ACTIVO' 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {nuevoEstado}
            </span>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Motivo (opcional)
          </label>
          <textarea
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Razón del cambio de estado..."
            className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>

        {nuevoEstado === 'INACTIVO' && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs sm:text-sm text-yellow-800">
              ⚠️ El usuario será desconectado inmediatamente y no podrá acceder al sistema hasta que se reactive.
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <Button
            label="Cancelar"
            color="info"
            onClick={onCancel}
            disabled={loading}
          />
          <Button
            label={loading ? "Cambiando..." : `Cambiar a ${nuevoEstado}`}
            color={nuevoEstado === 'ACTIVO' ? 'success' : 'warning'}
            onClick={handleConfirm}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}