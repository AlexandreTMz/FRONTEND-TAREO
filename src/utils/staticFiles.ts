export function getServerFileDocument(document: string, file: string) {
  return `${String(
    process.env.STATIC_FILES_URL
  )}/UPLOADS/${document}/documentos/${file}`;
}

export function getServerFilePhoto(document: string, file: string) {
  return `${String(
    process.env.STATIC_FILES_URL
  )}/UPLOADS/${document}/${file}.jpg`;
}
