import Swal from 'sweetalert2'

export const fireErrorMessage = (message: string) => {
  Swal.fire({
    title: 'Error!',
    text: message,
    icon: 'error',
    confirmButtonText: 'OK'
  })
}

export const fireSuccessMessage = (message: string) => {
  Swal.fire({
    title: 'Success!',
    text: message,
    icon: 'success',
    confirmButtonText: 'OK'
  })
}

export const fireToasterMessage = (message: string) => {
  Swal.fire({
    title: 'Info',
    text: message,
    icon: 'info',
    timer: 3000,
    timerProgressBar: true,
    position: 'top-end',
    showConfirmButton: false,
    backdrop: false
  })
}
