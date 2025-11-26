import React, { useState, useEffect, type JSX } from 'react';
import { Settings, Save, X, CheckCircle, AlertCircle, Shield, Truck, Gift, Lock, Edit2, History } from 'lucide-react';

// Interfaces y tipos
interface Campo {
  label: string;
  valor: string | number | boolean;
  tipo: 'number' | 'textarea' | 'boolean' | 'restricted';
}

interface Categoria {
  titulo: string;
  icon: string;
  campos: Record<string, Campo>;
}

interface Politicas {
  [key: string]: Categoria;
}

interface CambioHistorial {
  campo: string;
  valorAnterior: string | number | boolean;
  valorNuevo: string | number | boolean;
}

interface EntradaHistorial {
  fecha: string;
  categoria: string;
  cambios: CambioHistorial[];
}

const ConfigurarPoliticasAfrodita: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationMessage, setNotificationMessage] = useState<string>('');
  const [notificationType, setNotificationType] = useState<'success' | 'error'>('success');
  const [editingPolicy, setEditingPolicy] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string | number | boolean>>({});
  const [showHistory, setShowHistory] = useState<boolean>(false);
  
  // Políticas iniciales
  const initialPolicies: Politicas = {
    devoluciones: {
      titulo: 'Políticas de Devoluciones y Reembolsos',
      icon: '↩️',
      campos: {
        plazo_devolucion: { label: 'Plazo de devolución (días)', valor: '30', tipo: 'number' },
        condiciones: { label: 'Condiciones de devolución', valor: 'Producto sin usar, con etiquetas originales', tipo: 'textarea' },
        reembolso_automatico: { label: 'Reembolso automático', valor: true, tipo: 'boolean' },
        costo_envio_devolucion: { label: 'Cliente cubre envío de devolución', valor: false, tipo: 'boolean' }
      }
    },
    envios: {
      titulo: 'Políticas de Envíos y Tiempos de Entrega',
      icon: '🚚',
      campos: {
        tiempo_procesamiento: { label: 'Tiempo de procesamiento (días)', valor: '2', tipo: 'number' },
        tiempo_entrega_min: { label: 'Tiempo de entrega mínimo (días)', valor: '3', tipo: 'number' },
        tiempo_entrega_max: { label: 'Tiempo de entrega máximo (días)', valor: '7', tipo: 'number' },
        envio_gratis_desde: { label: 'Envío gratis desde (Bs)', valor: '200', tipo: 'number' },
        zonas_disponibles: { label: 'Zonas de envío disponibles', valor: 'Santa Cruz, La Paz, Cochabamba', tipo: 'textarea' }
      }
    },
    privacidad: {
      titulo: 'Políticas de Privacidad y Manejo de Datos',
      icon: '🔒',
      campos: {
        recopilacion_datos: { label: 'Datos que se recopilan', valor: 'Nombre, email, teléfono, dirección de envío', tipo: 'textarea' },
        uso_datos: { label: 'Uso de los datos', valor: 'Procesamiento de pedidos y comunicación relacionada con compras', tipo: 'textarea' },
        compartir_terceros: { label: 'Compartir con terceros', valor: false, tipo: 'boolean' },
        tiempo_retencion: { label: 'Tiempo de retención de datos (años)', valor: '5', tipo: 'number' },
        editable: { label: '', valor: true, tipo: 'restricted' }
      }
    },
    promociones: {
      titulo: 'Políticas de Promociones y Descuentos',
      icon: '🎁',
      campos: {
        descuento_maximo: { label: 'Descuento máximo permitido (%)', valor: '50', tipo: 'number' },
        acumulacion_descuentos: { label: 'Permitir acumulación de descuentos', valor: false, tipo: 'boolean' },
        vigencia_cupones: { label: 'Vigencia de cupones (días)', valor: '30', tipo: 'number' },
        limite_uso_cupon: { label: 'Límite de uso por cupón', valor: '1', tipo: 'number' }
      }
    },
    limites: {
      titulo: 'Límites y Restricciones del Sistema',
      icon: '⚙️',
      campos: {
        cantidad_maxima_producto: { label: 'Cantidad máxima por producto', valor: '10', tipo: 'number' },
        monto_minimo_compra: { label: 'Monto mínimo de compra (Bs)', valor: '20', tipo: 'number' },
        intentos_login: { label: 'Intentos de login permitidos', valor: '5', tipo: 'number' },
        tiempo_bloqueo: { label: 'Tiempo de bloqueo por intentos fallidos (min)', valor: '15', tipo: 'number' }
      }
    }
  };

  const [policies, setPolicies] = useState<Politicas>(() => {
    const saved = localStorage.getItem('afrodita_policies');
    return saved ? JSON.parse(saved) : initialPolicies;
  });

  const [changeHistory, setChangeHistory] = useState<EntradaHistorial[]>(() => {
    const saved = localStorage.getItem('afrodita_policies_history');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('afrodita_policies', JSON.stringify(policies));
  }, [policies]);

  useEffect(() => {
    localStorage.setItem('afrodita_policies_history', JSON.stringify(changeHistory));
  }, [changeHistory]);

  const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    devoluciones: AlertCircle,
    envios: Truck,
    privacidad: Shield,
    promociones: Gift,
    limites: Lock
  };

  const handleEdit = (categoryKey: string): void => {
    const category = policies[categoryKey];
    setEditingPolicy(categoryKey);
    setActiveCategory(categoryKey);
    
    const initialFormData: Record<string, string | number | boolean> = {};
    Object.entries(category.campos).forEach(([key, field]) => {
      initialFormData[key] = field.valor;
    });
    setFormData(initialFormData);
  };

  const handleInputChange = (fieldKey: string, value: string | number | boolean): void => {
    setFormData(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!editingPolicy) return false;
    const category = policies[editingPolicy];
    
    for (const [key, field] of Object.entries(category.campos)) {
      if (field.tipo === 'number') {
        const numValue = parseFloat(formData[key] as string);
        if (isNaN(numValue) || numValue < 0) {
          showNotificationWithMessage('Por favor ingresa valores numéricos válidos', 'error');
          return false;
        }
      }
      
      if (field.tipo === 'textarea' && !(formData[key] as string)?.trim()) {
        showNotificationWithMessage('Por favor completa todos los campos requeridos', 'error');
        return false;
      }
    }
    
    return true;
  };

  const handleSave = (): void => {
    if (!editingPolicy) return;
    
    // Validar si es una política restringida
    const category = policies[editingPolicy];
    const hasRestrictedField = Object.values(category.campos).some(
      field => field.tipo === 'restricted' && field.valor === false
    );
    
    if (hasRestrictedField && editingPolicy === 'privacidad') {
      showNotificationWithMessage('Esta política está restringida y no puede ser modificada', 'error');
      return;
    }

    if (!validateForm()) {
      return;
    }

    // Guardar cambios
    const updatedPolicies = { ...policies };
    Object.entries(formData).forEach(([key, value]) => {
      if (updatedPolicies[editingPolicy].campos[key]) {
        updatedPolicies[editingPolicy].campos[key].valor = value;
      }
    });

    setPolicies(updatedPolicies);

    // Registrar en historial
    const historyEntry: EntradaHistorial = {
      fecha: new Date().toLocaleString('es-BO'),
      categoria: policies[editingPolicy].titulo,
      cambios: Object.entries(formData).map(([key, value]) => ({
        campo: policies[editingPolicy].campos[key].label,
        valorAnterior: policies[editingPolicy].campos[key].valor,
        valorNuevo: value
      }))
    };
    
    setChangeHistory(prev => [historyEntry, ...prev].slice(0, 20));

    showNotificationWithMessage('Política actualizada exitosamente', 'success');
    setEditingPolicy(null);
    setActiveCategory(null);
  };

  const handleCancel = (): void => {
    setEditingPolicy(null);
    setActiveCategory(null);
    setFormData({});
  };

  const showNotificationWithMessage = (message: string, type: 'success' | 'error'): void => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const renderField = (fieldKey: string, field: Campo): JSX.Element | null => {
    if (field.tipo === 'restricted') return null;

    switch (field.tipo) {
      case 'number':
        return (
          <input
            type="number"
            value={formData[fieldKey] as string}
            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            min="0"
          />
        );
      case 'textarea':
        return (
          <textarea
            value={formData[fieldKey] as string}
            onChange={(e) => handleInputChange(fieldKey, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={3}
          />
        );
      case 'boolean':
        return (
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData[fieldKey] as boolean}
              onChange={(e) => handleInputChange(fieldKey, e.target.checked)}
              className="w-5 h-5 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
            />
            <span className="text-gray-700">{formData[fieldKey] ? 'Sí' : 'No'}</span>
          </label>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-3 rounded-lg">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Configuración de Políticas del Sistema</h1>
                <p className="text-gray-600 mt-1">Tienda Afrodita - Panel de Administración</p>
              </div>
            </div>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <History className="w-5 h-5" />
              <span>Historial</span>
            </button>
          </div>
        </div>

        {/* Notification */}
        {showNotification && (
          <div className={`fixed top-6 right-6 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3 ${
            notificationType === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white animate-slide-in`}>
            {notificationType === 'success' ? (
              <CheckCircle className="w-6 h-6" />
            ) : (
              <AlertCircle className="w-6 h-6" />
            )}
            <span className="font-medium">{notificationMessage}</span>
          </div>
        )}

        {/* History Panel */}
        {showHistory && (
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
              <History className="w-5 h-5 mr-2" />
              Historial de Cambios
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {changeHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay cambios registrados</p>
              ) : (
                changeHistory.map((entry, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-800">{entry.categoria}</span>
                      <span className="text-sm text-gray-500">{entry.fecha}</span>
                    </div>
                    <div className="space-y-1">
                      {entry.cambios.map((cambio, cidx) => (
                        <div key={cidx} className="text-sm text-gray-600">
                          <span className="font-medium">{cambio.campo}:</span>{' '}
                          <span className="line-through text-red-500">{String(cambio.valorAnterior)}</span> →{' '}
                          <span className="text-green-600">{String(cambio.valorNuevo)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Categorías de Políticas</h2>
              <div className="space-y-3">
                {Object.entries(policies).map(([key, category]) => {
                  const IconComponent = categoryIcons[key];
                  return (
                    <button
                      key={key}
                      onClick={() => handleEdit(key)}
                      disabled={editingPolicy !== null}
                      className={`w-full p-4 rounded-lg text-left transition-all ${
                        activeCategory === key
                          ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-800'
                      } ${editingPolicy !== null && editingPolicy !== key ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center space-x-3">
                        {IconComponent && <IconComponent className="w-6 h-6" />}
                        <div>
                          <div className="font-semibold">{category.titulo}</div>
                          <div className={`text-xs ${activeCategory === key ? 'text-pink-100' : 'text-gray-500'}`}>
                            {Object.keys(category.campos).filter(k => category.campos[k].tipo !== 'restricted').length} parámetros
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Policy Editor */}
          <div className="lg:col-span-2">
            {!editingPolicy ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  Selecciona una categoría para configurar
                </h3>
                <p className="text-gray-500">
                  Elige una política de la lista para ver y modificar sus parámetros
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    {policies[editingPolicy].titulo}
                  </h2>
                  <Edit2 className="w-6 h-6 text-pink-500" />
                </div>

                <div className="space-y-5">
                  {Object.entries(policies[editingPolicy].campos).map(([fieldKey, field]) => {
                    if (field.tipo === 'restricted') return null;
                    return (
                      <div key={fieldKey}>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          {field.label}
                        </label>
                        {renderField(fieldKey, field)}
                      </div>
                    );
                  })}
                </div>

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all flex items-center justify-center space-x-2 shadow-lg"
                  >
                    <Save className="w-5 h-5" />
                    <span>Guardar Cambios</span>
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center justify-center space-x-2"
                  >
                    <X className="w-5 h-5" />
                    <span>Cancelar</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ConfigurarPoliticasAfrodita;