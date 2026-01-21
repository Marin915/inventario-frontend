import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Subject,Observable } from 'rxjs';
import { environment } from '../../Environments/environment';
import { MaterialEntrega } from '../casa/lotes/lotes.component';


export interface CrearCasaDTO {
  nombre: string;
  lote: string;
  modelo: {
    id: number;
  };
}

export interface ModeloCasaDTO {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface MaterialCasaDTO {
  [x: string]: any;
  id: number;
  materialId: number;   // 👈 ESTE FALTABA
  clave?: string;   // 👈 agregar
  nombre: string;
  unidad: string;
  requerido: number;
  usado: number;
  fechaEntrega?: string;
}



export interface CasaDTO {
 id: number;
  nombre: string;
  lote: string;       // número o código de lote
  ubicacion?: string; // opcional, dirección completa o zona
  progreso: number;
  modelo: {
    id: number;
    nombre: string;
  };
}

export interface AsignacionMaterialRequest {
  casaId: number;       // Long en Java → number en TS
  materialId: number;
  requerido: number;
}

export interface AsignacionMaterialDTO {
  casaId: number;
  casaNombre: string;
  materialId: number;
  materialClave: string;
  requerido: number;
}


export interface SalidaCasaDTO {
  casaId: number;
  materialId: number;
  cantidad: number;
}



export interface MovimientoMaterialDTO {
  id?: number;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  materialId: number;
}


export interface PaginacionResponse<T> {
  archivos: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}


export interface Material {
  id?: number;
  clave: string;
  descripcion: string;
  unidadMedida?: string;
  precioUnitario?: number;
  categoria?: string;
}

export interface MaterialResumen {
  [x: string]: any;
  id: number;
  clave: string;
  descripcion: string;
  unidadMedida: string;
  cantidad: number;     
  entradas: number;
  salidas: number;
  precioUnitario: number;
  categoria: string;
}

export interface MovimientoMaterial {
  id?: number;
  tipo: 'ENTRADA' | 'SALIDA';
  cantidad: number;
  fecha?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MaterialesService {

  private readonly baseUrl = `${environment.apiUrl}/api/materiales`;
  //private apiUrl = 'http://localhost:8080/api/materiales'
  materialesUrl: any;
  private actualizacionInventarioSubject = new Subject<void>();

  constructor(private http: HttpClient) {}

  listar(): Observable<Material[]> {
    return this.http.get<Material[]>(this.baseUrl);
  }

  crear(material: Material): Observable<Material> {
    return this.http.post<Material>(this.baseUrl, material);
  }

  actualizar(id: number, material: Material): Observable<Material> {
    return this.http.put<Material>(`${this.baseUrl}/${id}`, material);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
  /* RESUMEN INVENTARIO */

 listarResumen(): Observable<MaterialResumen[]> {
  return this.http.get<MaterialResumen[]>(`${this.baseUrl}/resumen-todo`);
  // o `${this.baseUrl}/resumenTodo`
}
  /* ===== STOCK (opcional) ===== */

  obtenerStock(id: number): Observable<number> {
    return this.http.get<number>(`${this.baseUrl}/${id}/stock`);
  }
  /* ===== MOVIMIENTOS ===== */
 registrarMovimiento(
  materialId: number,
  movimiento: MovimientoMaterialDTO
): Observable<MovimientoMaterialDTO> {
  return this.http.post<MovimientoMaterialDTO>(
    `${this.baseUrl}/${materialId}/movimientos`,
    movimiento
  );
}
 descargarReporteExcel(): Observable<Blob> {
  const url = `${this.baseUrl}/reporte`; // baseUrl termina en /api/materiales
  return this.http.get(url, { responseType: 'blob' });
}

ObtenerPaginacion(page: number = 1,size: number = 10 ):
 Observable<PaginacionResponse<MaterialResumen>> {
  // 🔒 Normalizar page
  if (page < 1) { page = 1; }
  // 🔒 Normalizar size (tu backend lo valida, pero mejor aquí también)
  if (size !== -1 && (size < 1 || size > 100)) {  size = 10; }
  const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
  return this.http.get<PaginacionResponse<MaterialResumen>>(
    `${this.baseUrl}/paginados`,
    { params }
  );
}

eliminarUltimoMovimiento(materialId: number): Observable<void> {
  return this.http.delete<void>(
    `${this.baseUrl}/${materialId}/movimientos/ultimo`
  );
}

  // Registrar salida casa
  registrarSalidaCasa(salida: SalidaCasaDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/salida-casa`, salida);
  }

  // Crear casa
// Crear casa
crearCasa(casa: CrearCasaDTO): Observable<CasaDTO> {
  return this.http.post<CasaDTO>(
    `${this.baseUrl}/crear-casa`,
    casa
  );
}

  // Asignar material
  asignarMaterial(request: AsignacionMaterialRequest): Observable<AsignacionMaterialDTO> {
    return this.http.post<AsignacionMaterialDTO>(`${this.baseUrl}/asignar-material`, request);
  }

  // Obtener todas las casas
 // listarCasas(): Observable<CasaDTO[]> {
   // return this.http.get<CasaDTO[]>(`${this.apiUrl}/casas`);
  //}

  // Obtener materiales por casa id
  obtenerMaterialesPorCasa(casaId: number): Observable<MaterialCasaDTO[]> {
    return this.http.get<MaterialCasaDTO[]>(`${this.baseUrl}/casas/${casaId}/materiales`);
  }

  obtenerEntregas(): Observable<MaterialEntrega[]> {
    return this.http.get<MaterialEntrega[]>(
      `${this.baseUrl}/materiales/entregas`
    );
  }


 obtenerModelos(): Observable<ModeloCasaDTO[]> {
    return this.http.get<ModeloCasaDTO[]>(`${this.baseUrl}/modelos`);
  }




  // Emitir evento cuando se actualice inventario
  emitirActualizacionInventario() {
    this.actualizacionInventarioSubject.next();
  }

  // Observable para que otros componentes se suscriban
  get actualizacionInventario$(): Observable<void> {
    return this.actualizacionInventarioSubject.asObservable();
  }

/** 🔹 Obtener TODAS las casas */
obtenerCasas(): Observable<CasaDTO[]> {
  return this.http.get<CasaDTO[]>(
    `${this.baseUrl}/casas`
  );
}

/** 🔹 Obtener casas por modelo (Lotes / Duplex / Renta) */
obtenerCasasPorModelo(modeloId: number): Observable<CasaDTO[]> {
  return this.http.get<CasaDTO[]>(
    `${this.baseUrl}/casas?modeloId=${modeloId}`
  );
}

devolverMaterialCasa(payload: {
  casaId: number;
  materialId: number;
  cantidad: number;
}) {
  return this.http.post(
    `${this.baseUrl}/devolucion-casa`,
    payload
  );
}

}
