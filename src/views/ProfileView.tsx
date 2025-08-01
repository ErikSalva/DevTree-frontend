import { useForm } from 'react-hook-form';
import ErrorMessage from '../components/ErrorMessage';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import type { ProfileForm, User } from '../types';
import { updateProfile, uploadImage } from '../api/DevTreeAPI';
import { toast } from 'sonner';

export default function ProfileView() {
    // Esto es para acceder a user que esta en memoria ahora asi no tenemos que volver a consultar
    const queryClient = useQueryClient();
    const data : User = queryClient.getQueryData(['user'])! // ese ! es para asegurar que va a existir el User y no sera undefined;

    const { register, handleSubmit, formState: { errors } } = useForm<ProfileForm>({ defaultValues: {
        handle: data?.handle,
        description: data?.description,
    } })

    const updateProfileMutation = useMutation({
        mutationFn: updateProfile,
        onError: (error) =>{
            toast.error(error.message)
        },
        onSuccess: (data) =>{
            toast.success(data)
            queryClient.invalidateQueries({queryKey: ['user']})
        }
    }) 

    
    const updateImageMutation = useMutation({
        mutationFn: uploadImage,
        onError: (error) =>{
            toast.error(error.message)
        },
        onSuccess: (data) =>{
            queryClient.setQueryData(['user'], (prevData: User) =>{
                return {
                    ...prevData,
                    image: data
                }
            } ) //query optimista es para que la imagen se actualice mas rapido a la vista
        }
    }) 

    const handleChange = ( e: React.ChangeEvent<HTMLInputElement> ) =>{
        if(e.target.files){
            updateImageMutation.mutate(e.target.files[0])
        }
        
    }

    const handleProfileForm = ( formData: ProfileForm) =>{

        const user : User = queryClient.getQueryData(['user'])!
        user.description = formData.description
        user.handle = formData.handle
        updateProfileMutation.mutate(user)
    }

    return (
        <form 
            className="bg-white p-10 rounded-lg space-y-5"
            onSubmit={handleSubmit(handleProfileForm)}
        >
            <legend className="text-2xl text-slate-800 text-center">Editar Información</legend>
            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Handle:</label>
                <input
                    type="text"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="handle o Nombre de Usuario"
                    {...register('handle', {
                        required: 'El handle es obligatorio',
                    })}
                />
                {errors.handle && <ErrorMessage>{errors.handle.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="description"
                >Descripción:</label>
                <textarea
                    className="border-none bg-slate-100 rounded-lg p-2"
                    placeholder="Tu Descripción"
                    {...register('description', {
                        required: 'la descripción es obligatoria',
                    })}
                />
                {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
            </div>

            <div className="grid grid-cols-1 gap-2">
                <label
                    htmlFor="handle"
                >Imagen:</label>
                <input
                    id="image"
                    type="file"
                    name="handle"
                    className="border-none bg-slate-100 rounded-lg p-2"
                    accept="image/*"
                    onChange={handleChange}
                />
            </div>

            <input
                type="submit"
                className="bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
                value='Guardar Cambios'
            />
        </form>
    )
}