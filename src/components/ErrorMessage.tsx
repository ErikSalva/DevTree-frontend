
type ErrorMessageProps = {
  children: React.ReactNode;
}

// {children} : {children: React.ReactNode}) otra forma de definir el tipo de children

export default function ErrorMessage({children} : ErrorMessageProps) {
  return (
    <p className='bg-red-50 text-red-600 p-3 uppercase text-sm font-bold'>{children}</p>
  )
}
 