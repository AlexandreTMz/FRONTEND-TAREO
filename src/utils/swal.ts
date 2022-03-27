import swal from 'sweetalert2';

interface ISuccess {
  text?: string;
  title?: string;
}

interface IMessageConfirmation {
  text?: string;
  title?: string;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  cancelButtonColor?: string;
}

interface IMessageConfirmationResult {
  dismiss?: string;
  isConfirmed: boolean;
  isDenied: boolean;
  isDismissed: boolean;
}

export const MessageSuccess = ({ text, title }: ISuccess) => {
  void swal.fire({ icon: 'success', text, title });
};

export const MessageCommon = ({ text, title }: ISuccess) => {
  void swal.fire({
    title: title,
    html: text
  });
};

export const MessageError = ({ text, title }: ISuccess) => {
  void swal.fire({ icon: 'error', text, title });
};

export const MessageConfirmation = async ({
  text,
  title,
  showCancelButton = false,
  confirmButtonText = 'Aceptar',
  cancelButtonText = 'Cancelar',
  confirmButtonColor = 'var(--q-primary)',
  cancelButtonColor = 'var(--q-negative)',
}: IMessageConfirmation): Promise<IMessageConfirmationResult> => {
  return (await swal.fire({
    showConfirmButton: true,
    confirmButtonText,
    cancelButtonText,
    showCancelButton,
    confirmButtonColor,
    cancelButtonColor,
    title,
    text,
  })) as IMessageConfirmationResult;
};
