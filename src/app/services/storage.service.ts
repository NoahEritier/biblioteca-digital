import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PREFIX = 'biblioteca_';

  // Guardar datos
  setItem(key: string, value: any): void {
    try {
      const jsonValue = JSON.stringify(value);
      localStorage.setItem(this.PREFIX + key, jsonValue);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }

  // Obtener datos
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(this.PREFIX + key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }

  // Eliminar datos
  removeItem(key: string): void {
    localStorage.removeItem(this.PREFIX + key);
  }

  // Limpiar todos los datos de la aplicación
  clear(): void {
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.startsWith(this.PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  }

  // Obtener todas las claves
  getAllKeys(): string[] {
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(this.PREFIX)) {
        keys.push(key.replace(this.PREFIX, ''));
      }
    }
    return keys;
  }

  // Exportar todos los datos como JSON
  exportAllData(): string {
    const data: Record<string, any> = {};
    const keys = this.getAllKeys();
    keys.forEach(key => {
      data[key] = this.getItem(key);
    });
    return JSON.stringify(data, null, 2);
  }

  // Importar datos desde JSON
  importAllData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      Object.keys(data).forEach(key => {
        this.setItem(key, data[key]);
      });
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  // Descargar datos como archivo JSON
  downloadDataAsFile(filename: string = 'biblioteca-data.json'): void {
    const data = this.exportAllData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

