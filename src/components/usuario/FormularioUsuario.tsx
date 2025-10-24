import { useState, useEffect } from 'react';
import Button from '../ui/Button';
import type { Usuario, UsuarioCreate } from '../../services/usuarios/gestionUsuario';
import { UsuarioService } from '../../services/usuarios/gestionUsuario';

interface FormularioUsuarioProps {
    usuario?: Usuario | null;
    onSubmit: (datos: UsuarioCreate | Partial<UsuarioCreate>) => Promise<boolean>;
    onCancel: () => void;
    loading?: boolean;
}

interface FormErrors {
    nombre_completo?: string;
    nombre_usuario?: string;
    correo?: string;
    telefono?: string;
    contraseña?: string;
    confirmarContrasena?: string;
    fecha_contrato?: string;
}

export default function FormularioUsuario({
    usuario,
    onSubmit,
    onCancel,
    loading = false
}: FormularioUsuarioProps) {
    const esModoEditar = !!usuario;

    // Estados del formulario
    const [formData, setFormData] = useState({
        nombre_completo: usuario?.nombre_completo || '',
        nombre_usuario: usuario?.nombre_usuario || '',
        correo: usuario?.correo || '',
        telefono: usuario?.telefono || '',
        sexo: usuario?.sexo || 'M',
        rol: usuario?.rol || 'CLIENTE',
        contraseña: '',
        confirmarContrasena: '',
        fecha_contrato: usuario?.fecha_contrato || '',
        tipo_vendedor: usuario?.tipo_vendedor || 'TIENDA'
    });

    const [errores, setErrores] = useState<FormErrors>({});
    const [validando, setValidando] = useState(false);
    const [usernameDisponible, setUsernameDisponible] = useState<boolean | null>(null);
    const [emailDisponible, setEmailDisponible] = useState<boolean | null>(null);

    // Validaciones en tiempo real
    useEffect(() => {
        if (formData.nombre_usuario && formData.nombre_usuario !== usuario?.nombre_usuario) {
            const timer = setTimeout(() => {
                verificarUsernameDisponible(formData.nombre_usuario);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [formData.nombre_usuario, usuario?.nombre_usuario]);

    useEffect(() => {
        if (formData.correo && formData.correo !== usuario?.correo) {
            const timer = setTimeout(() => {
                verificarEmailDisponible(formData.correo);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [formData.correo, usuario?.correo]);

    const verificarUsernameDisponible = async (username: string) => {
        try {
            setValidando(true);
            const params: any = { username };
            // Si estamos editando, enviar el ID del usuario
            if (usuario?.id_usuario) {
                params.usuario_id = usuario.id_usuario;
            }
            const response = await UsuarioService.verificarUsername(params);
            setUsernameDisponible(response.data.disponible);
        } catch (error) {
            setUsernameDisponible(null);
        } finally {
            setValidando(false);
        }
    };

    const verificarEmailDisponible = async (email: string) => {
        try {
            setValidando(true);
            const params: any = { email };

            if (usuario?.id_usuario) {
                params.usuario_id = usuario.id_usuario;
            }
            const response = await UsuarioService.verificarEmail(params);
            setEmailDisponible(response.data.disponible);
        } catch (error) {
            setEmailDisponible(null);
        } finally {
            setValidando(false);
        }
    };

    const validarFormulario = (): boolean => {
        const nuevosErrores: FormErrors = {};

        // Validaciones básicas
        if (!formData.nombre_completo.trim()) {
            nuevosErrores.nombre_completo = 'El nombre completo es requerido';
        } else if (formData.nombre_completo.trim().length < 3) {
            nuevosErrores.nombre_completo = 'Mínimo 3 caracteres';
        }

        if (!formData.nombre_usuario.trim()) {
            nuevosErrores.nombre_usuario = 'El nombre de usuario es requerido';
        } else if (!/^[a-zA-Z0-9._]+$/.test(formData.nombre_usuario)) {
            nuevosErrores.nombre_usuario = 'Solo letras, números, . y _';
        } else if (usernameDisponible === false) {
            nuevosErrores.nombre_usuario = 'Este username no está disponible';
        }

        if (!formData.correo.trim()) {
            nuevosErrores.correo = 'El correo es requerido';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
            nuevosErrores.correo = 'Formato de email inválido';
        } else if (emailDisponible === false) {
            nuevosErrores.correo = 'Este email ya está registrado';
        }

        if (formData.telefono && !/^[0-9]{7,8}$/.test(formData.telefono)) {
            nuevosErrores.telefono = 'Formato boliviano (7-8 dígitos)';
        }

        // Validaciones solo para modo crear
        if (!esModoEditar) {
            if (!formData.contraseña) {
                nuevosErrores.contraseña = 'La contraseña es requerida';
            } else {
                if (formData.contraseña.length < 8) {
                    nuevosErrores.contraseña = 'Mínimo 8 caracteres';
                } else if (!/(?=.*[A-Z])/.test(formData.contraseña)) {
                    nuevosErrores.contraseña = 'Al menos 1 mayúscula';
                } else if (!/(?=.*[0-9])/.test(formData.contraseña)) {
                    nuevosErrores.contraseña = 'Al menos 1 número';
                }
            }

            if (formData.contraseña !== formData.confirmarContrasena) {
                nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden';
            }
        }

        // Validaciones condicionales por rol
        if (['ADMINISTRADOR', 'VENDEDOR'].includes(formData.rol) && !formData.fecha_contrato) {
            nuevosErrores.fecha_contrato = 'La fecha de contrato es requerida';
        }

        setErrores(nuevosErrores);
        return Object.keys(nuevosErrores).length === 0;
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

    const fortaleza = getFortalezaContrasena(formData.contraseña);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validarFormulario()) {
            return;
        }

        // Preparar datos base comunes
        const datosBase = {
            nombre_completo: formData.nombre_completo.trim(),
            nombre_usuario: formData.nombre_usuario.trim(),
            correo: formData.correo.trim(),
            sexo: formData.sexo,
            rol: formData.rol
        };

        // Campos opcionales
        if (formData.telefono.trim()) {
            (datosBase as any).telefono = formData.telefono.trim();
        }

        // Campos según rol
        if (['ADMINISTRADOR', 'VENDEDOR'].includes(formData.rol)) {
            (datosBase as any).fecha_contrato = formData.fecha_contrato;
        }

        if (formData.rol === 'VENDEDOR') {
            (datosBase as any).tipo_vendedor = formData.tipo_vendedor;
        }

        let success = false;

        if (esModoEditar) {
            // Modo editar - enviar Partial<UsuarioCreate>
            const datosEditar: Partial<UsuarioCreate> = { ...datosBase };
            success = await onSubmit(datosEditar);
        } else {
            // Modo crear - enviar UsuarioCreate completo con contraseña
            const datosCrear: UsuarioCreate = {
                ...datosBase,
                contraseña: formData.contraseña
            };
            success = await onSubmit(datosCrear);

            // Limpiar contraseñas solo si fue exitoso en modo crear
            if (success) {
                setFormData(prev => ({
                    ...prev,
                    contraseña: '',
                    confirmarContrasena: ''
                }));
            }
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Limpiar error del campo cuando el usuario empiece a escribir
        if (errores[field as keyof FormErrors]) {
            setErrores(prev => ({ ...prev, [field]: undefined }));
        }

        // Resetear disponibilidad si cambia username/email
        if (field === 'nombre_usuario') {
            setUsernameDisponible(null);
        }
        if (field === 'correo') {
            setEmailDisponible(null);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto my-4">
                <div className="p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                        {esModoEditar ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
                    </h2>
                    {usuario && (
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            Editando: {usuario.nombre_completo} (@{usuario.nombre_usuario})
                        </p>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                    {/* Información Básica */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Nombre Completo *
                            </label>
                            <input
                                type="text"
                                value={formData.nombre_completo}
                                onChange={(e) => handleChange('nombre_completo', e.target.value)}
                                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.nombre_completo ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Ej: Juan Pérez García"
                            />
                            {errores.nombre_completo && (
                                <p className="text-red-500 text-xs mt-1">{errores.nombre_completo}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Nombre de Usuario *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={formData.nombre_usuario}
                                    onChange={(e) => handleChange('nombre_usuario', e.target.value)}
                                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.nombre_usuario ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Ej: juan.perez"
                                />
                                {validando && (
                                    <div className="absolute right-3 top-2.5">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                                {usernameDisponible !== null && !validando && (
                                    <div className={`absolute right-3 top-2.5 ${usernameDisponible ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {usernameDisponible ? '✓' : '✗'}
                                    </div>
                                )}
                            </div>
                            {errores.nombre_usuario && (
                                <p className="text-red-500 text-xs mt-1">{errores.nombre_usuario}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Correo Electrónico *
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    value={formData.correo}
                                    onChange={(e) => handleChange('correo', e.target.value)}
                                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.correo ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Ej: juan@empresa.com"
                                />
                                {validando && (
                                    <div className="absolute right-3 top-2.5">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                    </div>
                                )}
                                {emailDisponible !== null && !validando && (
                                    <div className={`absolute right-3 top-2.5 ${emailDisponible ? 'text-green-500' : 'text-red-500'
                                        }`}>
                                        {emailDisponible ? '✓' : '✗'}
                                    </div>
                                )}
                            </div>
                            {errores.correo && (
                                <p className="text-red-500 text-xs mt-1">{errores.correo}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Teléfono
                            </label>
                            <input
                                type="tel"
                                value={formData.telefono}
                                onChange={(e) => handleChange('telefono', e.target.value)}
                                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.telefono ? 'border-red-500' : 'border-gray-300'
                                    }`}
                                placeholder="Ej: 77712345"
                            />
                            {errores.telefono && (
                                <p className="text-red-500 text-xs mt-1">{errores.telefono}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Sexo
                            </label>
                            <select
                                value={formData.sexo}
                                onChange={(e) => handleChange('sexo', e.target.value)}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="M">Masculino</option>
                                <option value="F">Femenino</option>
                                <option value="O">Otro</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Rol *
                            </label>
                            <select
                                value={formData.rol}
                                onChange={(e) => handleChange('rol', e.target.value)}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="CLIENTE">Cliente</option>
                                <option value="VENDEDOR">Vendedor</option>
                                <option value="ADMINISTRADOR">Administrador</option>
                            </select>
                        </div>
                    </div>

                    {/* Campos de contraseña solo en modo crear */}
                    {!esModoEditar && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Contraseña *
                                </label>
                                <input
                                    type="password"
                                    value={formData.contraseña}
                                    onChange={(e) => handleChange('contraseña', e.target.value)}
                                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.contraseña ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Mínimo 8 caracteres"
                                />
                                {formData.contraseña && (
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-xs text-gray-500">
                                            Fortaleza: <span className={fortaleza.color}>{fortaleza.texto}</span>
                                        </span>
                                        <div className="flex space-x-1 text-xs">
                                            <span className={formData.contraseña.length >= 8 ? 'text-green-500' : 'text-gray-300'}>8+</span>
                                            <span className={/(?=.*[A-Z])/.test(formData.contraseña) ? 'text-green-500' : 'text-gray-300'}>A-Z</span>
                                            <span className={/(?=.*[0-9])/.test(formData.contraseña) ? 'text-green-500' : 'text-gray-300'}>0-9</span>
                                        </div>
                                    </div>
                                )}
                                {errores.contraseña && (
                                    <p className="text-red-500 text-xs mt-1">{errores.contraseña}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                    Confirmar Contraseña *
                                </label>
                                <input
                                    type="password"
                                    value={formData.confirmarContrasena}
                                    onChange={(e) => handleChange('confirmarContrasena', e.target.value)}
                                    className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.confirmarContrasena ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                    placeholder="Repite la contraseña"
                                />
                                {errores.confirmarContrasena && (
                                    <p className="text-red-500 text-xs mt-1">{errores.confirmarContrasena}</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Campos condicionales para ADMINISTRADOR y VENDEDOR */}
                    {['ADMINISTRADOR', 'VENDEDOR'].includes(formData.rol) && (
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Fecha de Contrato *
                            </label>
                            <input
                                type="date"
                                value={formData.fecha_contrato}
                                onChange={(e) => handleChange('fecha_contrato', e.target.value)}
                                className={`w-full px-3 py-2 text-sm sm:text-base border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errores.fecha_contrato ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errores.fecha_contrato && (
                                <p className="text-red-500 text-xs mt-1">{errores.fecha_contrato}</p>
                            )}
                        </div>
                    )}

                    {/* Campo específico para VENDEDOR */}
                    {formData.rol === 'VENDEDOR' && (
                        <div>
                            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                                Tipo de Vendedor
                            </label>
                            <select
                                value={formData.tipo_vendedor}
                                onChange={(e) => handleChange('tipo_vendedor', e.target.value)}
                                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="TIENDA">Tienda</option>
                                <option value="ONLINE">Online</option>
                            </select>
                        </div>
                    )}

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t sticky bottom-0 bg-white">
                        <Button
                            type="button"
                            label="Cancelar"
                            color="info"
                            onClick={onCancel}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            label={loading ? (esModoEditar ? "Guardando..." : "Creando...") : (esModoEditar ? "Guardar Cambios" : "Crear Usuario")}
                            color={esModoEditar ? "warning" : "success"}
                            disabled={loading}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
}