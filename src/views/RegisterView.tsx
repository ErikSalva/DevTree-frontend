import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import ErrorMessage from '../components/ErrorMessage';
import type { RegisterFormData } from '../types';
import { useMutation } from '@tanstack/react-query';
import { registerUser } from '../api/DevTreeAPI';

export default function RegisterView() {
    const location = useLocation()
    const navigate = useNavigate()
    const initialValues: RegisterFormData = {
        name: '',
        email: '',
        handle: location?.state?.handle || '',
        password: '',
        password_confirmation: ''
    };

    const { register, watch, reset, handleSubmit, formState: { errors } } = useForm({ defaultValues: initialValues });

    const password = watch('password');

    const mutation = useMutation({
        mutationFn: registerUser,
        onSuccess: (data) => {
            toast.success(data);
            navigate('/admin');
            reset()
            navigate('/auth/login');
        },
        onError: (error) => {
            toast.error(error.message);
        }
    })


    const onSubmit = async (formData: RegisterFormData) => {
        mutation.mutate(formData);
    };


    return (
        <>
            <h1 className='text-4xl text-white font-bold'>Crear Cuenta</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
            >
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="name" className="text-2xl text-slate-500">Nombre</label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Tu Nombre"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('name', {
                            required: 'El nombre es obligatorio',
                            minLength: {
                                value: 3,
                                message: 'El nombre debe tener al menos 3 caracteres'
                            }
                        })}
                    />
                    {errors.name && <ErrorMessage>{errors.name?.message}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="email" className="text-2xl text-slate-500">E-mail</label>
                    <input
                        id="email"
                        type="email"
                        placeholder="Email de Registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('email', {
                            pattern: {
                                value: /\S+@\S+\.\S+/,
                                message: "Email no válido",
                            },
                            required: 'El email es obligatorio',
                        })}

                    />
                    {errors.email && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="handle" className="text-2xl text-slate-500">Handle</label>
                    <input
                        id="handle"
                        type="text"
                        placeholder="Nombre de usuario: sin espacios"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('handle', {
                            required: 'El handle es obligatorio',
                            minLength: {
                                value: 3,
                                message: 'El handle debe tener al menos 3 caracteres'
                            }
                        })}

                    />
                    {errors.email && <ErrorMessage>{errors.email?.message}</ErrorMessage>}
                </div>
                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password" className="text-2xl text-slate-500">Password</label>
                    <input
                        id="password"
                        type="password"
                        placeholder="Password de Registro"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('password', {
                            required: 'El password es obligatorio',
                            minLength: {
                                value: 8,
                                message: 'El password debe tener al menos 8 caracteres'
                            }
                        })}
                    />
                    {errors.password && <ErrorMessage>{errors.password?.message}</ErrorMessage>}

                </div>

                <div className="grid grid-cols-1 space-y-3">
                    <label htmlFor="password_confirmation" className="text-2xl text-slate-500">Repetir Password</label>
                    <input
                        id="password_confirmation"
                        type="password"
                        placeholder="Repetir Password"
                        className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
                        {...register('password_confirmation', {
                            required: 'La confirmación del password es obligatoria',
                            validate: (value) => value === password || 'Los passwords no coinciden'
                        })}
                    />
                    {errors.password_confirmation && <ErrorMessage>{errors.password_confirmation?.message}</ErrorMessage>}
                </div>

                <input
                    type="submit"
                    className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                    value='Crear Cuenta'
                />
            </form>
            <nav className='mt-10'>
                <Link
                    className='text-center text-white text-lg block'
                    to='/auth/login'
                >¿Ya tenés una cuenta? Inicia sesión
                </Link>
            </nav>
        </>

    )
}
