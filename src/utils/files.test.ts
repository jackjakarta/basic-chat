import { getFileExtension } from './files';

describe('getFileExtension', () => {
  it('should return the file extension for a normal file', () => {
    expect(getFileExtension('document.pdf')).toBe('pdf');
    expect(getFileExtension('image.jpg')).toBe('jpg');
    expect(getFileExtension('script.js')).toBe('js');
  });

  it('should return the extension for files with multiple dots', () => {
    expect(getFileExtension('archive.tar.gz')).toBe('gz');
    expect(getFileExtension('config.local.json')).toBe('json');
    expect(getFileExtension('backup.2023.12.01.sql')).toBe('sql');
  });

  it('should return the filename when there is no extension', () => {
    expect(getFileExtension('README')).toBe('README');
    expect(getFileExtension('Dockerfile')).toBe('Dockerfile');
    expect(getFileExtension('makefile')).toBe('makefile');
  });

  it('should handle files that start with a dot', () => {
    expect(getFileExtension('.gitignore')).toBe('gitignore');
    expect(getFileExtension('.env')).toBe('env');
    expect(getFileExtension('.bashrc')).toBe('bashrc');
  });

  it('should handle files with dot but no extension', () => {
    expect(getFileExtension('file.')).toBe('');
    expect(getFileExtension('document.')).toBe('');
  });

  it('should handle empty string', () => {
    expect(getFileExtension('')).toBe('');
  });

  it('should handle single dot', () => {
    expect(getFileExtension('.')).toBe('');
  });

  it('should handle multiple consecutive dots', () => {
    expect(getFileExtension('file..txt')).toBe('txt');
    expect(getFileExtension('document...')).toBe('');
  });

  it('should handle long extensions', () => {
    expect(getFileExtension('presentation.pptx')).toBe('pptx');
    expect(getFileExtension('document.docx')).toBe('docx');
  });

  it('should handle uppercase extensions', () => {
    expect(getFileExtension('IMAGE.JPG')).toBe('JPG');
    expect(getFileExtension('Document.PDF')).toBe('PDF');
  });
});
