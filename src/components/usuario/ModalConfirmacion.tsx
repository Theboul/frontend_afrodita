import Button from "../ui/Button";

interface ModalConfirmacionProps {
  show: boolean;
  titulo: string;
  mensaje: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning';
}

export default function ModalConfirmacion({
  show,
  titulo,
  mensaje,
  onConfirm,
  onCancel,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = 'danger'
}: ModalConfirmacionProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
          {titulo}
        </h3>
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
          {mensaje}
        </p>
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <Button
            label={cancelText}
            color="info"
            onClick={onCancel}
          />
          <Button
            label={confirmText}
            color={type === 'danger' ? 'danger' : 'warning'}
            onClick={onConfirm}
          />
        </div>
      </div>
    </div>
  );
}