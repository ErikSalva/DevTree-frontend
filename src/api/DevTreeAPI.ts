import { isAxiosError } from 'axios';
import api from '../config/axios';
import type { LoginFormData, RegisterFormData, User, UserHandle } from '../types';


export async function getUser() {
    try {
      const { data } = await api.get<User>('/user', 
      //{
      //  headers: {
      //    Authorization: `Bearer ${token}`
      //  }
      //  } ACA ya no es necesario porque el interceptor de axios ya maneja el token
    );
      return data;

    } catch (error) {
       if (isAxiosError(error)) {
        throw new Error(error.response?.data.message);
      }
    }
}



export async function updateProfile(formData: User) {
  try {
    const { data } = await api.patch<{ message: string }>('/user', formData)
    return data.message;

  } catch (error) {
      if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
}



export async function uploadImage(file : File) {
  let formData = new FormData()
  formData.append('file', file)
  try {
    const { data : {image} } : {data:{image: string}} = await api.post('/user/image', formData);
    return image;

  } catch (error) {
      if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
}


export async function getUserByHandle(handle: string) {
  try {

    const { data } = await api.get<UserHandle>(`/${handle}`)
    return data

  } catch (error) {
      if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
}

export async function searchByHandle(handle: string) {
  try {

    const {data} = await api.post<{ message: string }>('/search', { handle })

    return data.message

  } catch (error) {
      if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
}


export async function loginUser(formData: LoginFormData) {
  try {
    const { data } = await api.post('/auth/login', formData)
    return data;

  } catch (error) {
      if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
}


export async function registerUser(formData: RegisterFormData) {
  try {
    const { data } = await api.post(`/auth/register`, formData);
    return data.message;

  } catch (error) {
      if (isAxiosError(error)) {
      throw new Error(error.response?.data.message);
    }
  }
}
