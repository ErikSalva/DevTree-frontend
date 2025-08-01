
import { useQuery } from '@tanstack/react-query';
import { Navigate } from 'react-router-dom';
import { getUser } from '../api/DevTreeAPI';
import DevTree from '../components/DevTree';

export default function AppLayout() {

    const { data, isLoading, isError} = useQuery({
        // Esto es para que se ejecute la función getUser al cargar el componente
        // y se obtenga la información del usuario.
        // Hace la consulta usando la función getUser
        queryFn: getUser,
        queryKey: ['user'],// Clave única para la consulta
        retry: 2, // Número de reintentos en caso de error
        refetchOnWindowFocus: false, // No volver a consultar al enfocar la ventana
    });

    if (isLoading) {
        return <div className="text-center text-2xl">Cargando...</div>;
    }
    if (isError) {
        // Navigate redirije al usuario durante el renderizado
        // Si hay un error al obtener el usuario, redirige a la página de login
        // A diferencia de el useNavigate que redirige después de un evento
        // como un click o un submit.
        return <Navigate to="/auth/login" replace={true} />;
    }

    if(data) return <DevTree data={ data }/>
}