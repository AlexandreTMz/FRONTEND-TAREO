export function selectFile(contentType: string, multiple: boolean) {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = multiple;
    input.accept = contentType;

    input.onchange = () => {
      const files = Array.from(input.files as FileList);
      if (multiple) resolve(files);
      else resolve(files[0]);
    };

    input.click();
  });
}
