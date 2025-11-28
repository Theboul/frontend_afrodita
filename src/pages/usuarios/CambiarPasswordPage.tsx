import React from 'react';
import ModuleLayout from '../../layouts/ModuleLayout';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const CambiarPasswordPage: React.FC = () => {
  return (
    <ModuleLayout title="Cambiar Contraseña">
      <div className="max-w-xl mx-auto">
        <Card>
          <h2 className="text-xl font-bold mb-4">Cambiar Contraseña</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="current-password">
                Contraseña Actual
              </label>
              <input
                id="current-password"
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="new-password">
                Nueva Contraseña
              </label>
              <input
                id="new-password"
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirm-password">
                Confirmar Nueva Contraseña
              </label>
              <input
                id="confirm-password"
                type="password"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
            <div className="flex items-center justify-between">
              <Button
                label="Cambiar Contraseña"
                color="primary"
                onClick={() => {
                  // Lógica para cambiar contraseña
                }}
              />
            </div>
          </form>
        </Card>
      </div>
    </ModuleLayout>
  );
};

export default CambiarPasswordPage;
