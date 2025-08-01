import { useEffect, useState } from 'react'
import { social } from '../data/social'
import DevTreeInput from '../components/DevTreeInput'
import { isValidUrl } from '../utils'
import { toast } from 'sonner'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateProfile } from '../api/DevTreeAPI'
import type { SocialNetwork, User } from '../types'

export default function LinkTreeView() {
  const [devTreeLinks, setDevTreeLinks] = useState(social)

  const queryClient = useQueryClient()
  const user : User = queryClient.getQueryData(['user'])!
  const { mutate } = useMutation({
    mutationFn: updateProfile,
    onError: (error) => {
      toast.error(error.message)
    },
    onSuccess: () =>{
      toast.success('Actualizado Correctamente')
    }
  })

  useEffect(()=>{ 
    // aca que apsa si links viene ""
    const updatedData = devTreeLinks.map(item =>{
      const userLink = JSON.parse(user.links).find((link : SocialNetwork) => link.name === item.name)
      if(userLink) {
        return {...item, url: userLink.url, enabled: userLink.enabled}
      }
      return item
    })
    setDevTreeLinks(updatedData)
  }, [])

  const handleUrlChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    // e.target.name es el nombre del input, que es el nombre de la red social
    // Aca actualizamos el estado de devTreeLinks
    // para que se actualice el input con el valor que el usuario escribe
    const updatedLinks = devTreeLinks.map( link => link.name === e.target.name ? {...link, url: e.target.value} : link)
    setDevTreeLinks(updatedLinks)
  }

  const links : SocialNetwork[] = JSON.parse(user.links)

  const handleEnableLink = ( socialNetwork: string) => {
    const updatedLinks = devTreeLinks.map( link => {
      if (link.name === socialNetwork) {
        if(isValidUrl(link.url)){
          return {...link, enabled: !link.enabled }
        } else {
          toast.error('URL no válida')
        }
        
      }
      return link 
    })

    setDevTreeLinks(updatedLinks)

    const selectedSocialNetwork = updatedLinks.find(link => link.name === socialNetwork)

    let updatedItems : SocialNetwork[] = []

    if(selectedSocialNetwork?.enabled){
      const id = links.filter(link => link.id > 0).length + 1
      if (links.some(link => link.name === socialNetwork)) {
        updatedItems = links.map(link => {
          if (link.name === socialNetwork) {
            return {...link, enabled: true, id}
          }
          return link
        })

      } else {
        const newItem = {
          ...selectedSocialNetwork,
          id, // Asignar un nuevo ID
        }
        updatedItems = [...links, newItem]
      }
      
    } else {
      const indexToUpdate = links.findIndex(link => link.name === socialNetwork)
      updatedItems = links.map(link => {
        if (link.name === socialNetwork) {
          return {...link, enabled: false, id: 0}
        } else if(link.id > indexToUpdate && (indexToUpdate !== 0 && link.id === 1 )) {
          return{
          ...link,
          id: link.id -1
          }
        } else{
          return link
        }

      })
    }

    // Esto almacena en la base de datos los cambios que el usuario hace en su perfil
    // y actualiza el estado del usuario en la cache de react-query
    queryClient.setQueryData(['user'], (prevData: User) => {
      return {
        ...prevData,
        links: JSON.stringify(updatedItems)
      }
    })
  }

  return (
    <div className='space-y-5'>
      {devTreeLinks.map(item => (
        <DevTreeInput
          key={item.name}
          item={item}
          handleUrlChange={handleUrlChange}
          handleEnableLink={handleEnableLink}
        />
      ))}
      <button
      className='bg-cyan-400 p-2 text-lg w-full uppercase text-slate-600 rounded-lg font-bold'
      onClick={() => mutate(queryClient.getQueryData(['user'])!)}
      > Guardar Cambios</button>
    </div>
  )
}
