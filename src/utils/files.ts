export function getFileExtension(fileName: string) {
  const parts = fileName.split('.');

  const lastPart = parts[parts.length - 1];

  if (lastPart === undefined) {
    return fileName;
  }

  return lastPart;
}
