import { Component, OnInit,ViewChild, ElementRef, AfterViewInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar/navbar.component';
import { MaterialesService,MaterialResumen } from '../../services/materiales.service';
import * as XLSX from 'xlsx';

import { saveAs } from 'file-saver';

@Component({
  selector: 'app-materiales',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent],
  templateUrl: './materiales.component.html',
  styleUrl: './materiales.component.css'
})

export class MaterialesComponent implements OnInit, AfterViewInit  {
  
  @ViewChild('formTop', { static: false }) formTop!: ElementRef;


[x: string]: any;

  materiales: MaterialResumen[] = [];
  materialesFiltrados: MaterialResumen[] = [];
  filtro = '';
  cargando = false;
  material: any = {
    clave: '',
    descripcion: '',
    unidadMedida: '',
    precioUnitario: 0,
    categoria: ''
  };
  modalEliminarVisible = false;
  materialIdAEliminar?: number;
  movimiento = {
    tipo: 'ENTRADA' as 'ENTRADA' | 'SALIDA',
    cantidad: 0
  };
  cantidadOriginal = 0;
  editando = false;
  materialIdEditando?: number;
  materialSeleccionado: MaterialResumen | null = null;

  
  // Paginación
  data: any[] = [];

  // ================= FILTROS =================
  trackingId = '';
  selectedYear = '';
  selectedMonth = '';
  selectedStatus = '';
  startDate = '';
  endDate = '';

  hasSearched = false;
  noRecordsFound = false;
  isTrackingIdEntered = false;

  // ================= PAGINACIÓN =================
  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 0;
  totalItems = 0;

  itemsPerPageOptions = [10, 20, 50, 100, -1];

  // ================= MODALES =================
  mostrarModal = false;
  mostrarModalExitoso = false;
  mostrarModalError = false;
  mostrarModalMessage = false;

  accion = '';
  idSeleccionado: number | null = null;
  errorMessage = '';
  Message = '';

  puedeDeshacer = false;

  mensajeModal: string = '';
  modalMensajeVisible = false;
  materialSeleccionadoId: number | null = null;


  constructor(private materialService: MaterialesService) {}

  ngAfterViewInit(): void {
    // ya existe el DOM
  }

  ngOnInit(): void {
  this.consultarBackend();
   // this.cargarMateriales();

    this.materialService.actualizacionInventario$.subscribe(() => {
    console.log('Actualización de inventario recibida, recargando...');
    this.consultarBackend();
  });

  }

  cargarMateriales(): void {
  this.cargando = true;

  this.materialService.listarResumen().subscribe({
    next: data => {
      this.materiales = data;
      this.materialesFiltrados = [...data];
      this.totalItems = data.length;
      this.totalPages = 1;
      this.currentPage = 1;
      this.cargando = false;
    },
    error: err => {
      console.error(err);
      this.materiales = [];
      this.materialesFiltrados = [];
      this.cargando = false;
    }
  });
}

buscarMateriales(texto: string): void {
  const t = texto.toLowerCase();
  if (!t) {
    this.materialesFiltrados = [...this.materiales];
    return;
  }
  this.materialesFiltrados = this.materiales.filter(m =>
    m.clave.toLowerCase().includes(t) ||
    m.descripcion.toLowerCase().includes(t)
  );
}

 guardar(form: any): void {
  if (form.invalid) return;
  const payload = {
    clave: this.material.clave,
    descripcion: this.material.descripcion,
    unidadMedida: this.material.unidadMedida,
    precioUnitario: this.material.precioUnitario,
    categoria: this.material.categoria
  };
  if (this.editando && this.materialIdEditando) {
    this.materialService.actualizar(this.materialIdEditando, payload)
      .subscribe({
        next: () => {
          //  SOLO SI HAY MOVIMIENTO
          if (this.movimiento.cantidad > 0) {
            this.registrarMovimiento();
          } else {
          this.consultarBackend();
            this.reset();
          }
        },
        error: err => {
          console.error('Error al actualizar', err);
        }
      });
  } else {
    this.materialService.crear(payload)
      .subscribe(materialCreado => {
        this.materialIdEditando = materialCreado.id;
        this.registrarMovimiento();
        this.reset();
      });
  }
}
 registrarMovimiento(): void {
  this.materialService
    .registrarMovimiento(this.materialIdEditando!, {
      tipo: this.movimiento.tipo,
      cantidad: this.movimiento.cantidad,
      materialId: this.materialIdEditando!
    })
    .subscribe({
      next: () => {
        this.movimiento.cantidad = 0;
        this.consultarBackend();
        this.reset(); 
      },
      error: err => {
        console.error(err);
        alert('Error al registrar movimiento');
      }
    });
}


editar(m: MaterialResumen): void {
  this.material = {
    clave: m.clave,
    descripcion: m.descripcion,
    unidadMedida: m.unidadMedida,
    precioUnitario: m.precioUnitario,
    categoria: m.categoria
  };

  this.cantidadOriginal = m.cantidad;

  this.materialSeleccionadoId = m.id; // 🔑 CLAVE
  this.materialIdEditando = m.id;

  this.editando = true;

  setTimeout(() => {
    this.formTop?.nativeElement?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
}

  /* BUTTTON ELIMINAR
 eliminar(id: number): void {
  this.materialIdAEliminar = id;
  this.modalEliminarVisible = true;  // Mostrar modal
}*/
confirmarEliminar(): void {
  if (this.materialIdAEliminar != null) {
    this.materialService.eliminar(this.materialIdAEliminar)
      .subscribe(() => {
        this.cargarMateriales();
        this.modalEliminarVisible = false;
        this.materialIdAEliminar = undefined;
      }, () => {
        alert('Error al eliminar el material');
        this.modalEliminarVisible = false;
        this.materialIdAEliminar = undefined;
      });
  }
}
cancelarEliminar(): void {
  this.modalEliminarVisible = false;
  this.materialIdAEliminar = undefined;
}
  reset(): void {
    this.material = {
      clave: '',
      descripcion: '',
      unidadMedida: '',
      precioUnitario: 0,
      categoria: ''
    };

    this.movimiento = {
      tipo: 'ENTRADA',
      cantidad: 0
    };

    this.cantidadOriginal = 0;
    this.editando = false;
    this.materialIdEditando = undefined;
  }
  descargarReporte() {
  this.materialService.descargarReporteExcel().subscribe({
    next: (blob) => {
      saveAs(blob, 'Reporte_Inventario_Materiales.xlsx');
    },
    error: (err) => {
      console.error('Error al descargar reporte:', err);
      alert('Error al descargar el reporte');
    }
  });
}

  onConsultar(): void {
    this.currentPage = 1;
    this.hasSearched = true;
    this.consultarBackend();
  }

consultarBackend(): void {
   if (this.cargando) return;
  this.cargando = true;
 
  this.materialService.ObtenerPaginacion(
    this.currentPage,
    this.itemsPerPage
  ).subscribe({
    next: resp => {

      // 🔑 ESTO ES LO QUE FALTABA
      this.materiales = resp.archivos;
      this.materialesFiltrados = [...resp.archivos];
        //  SI HAY AL MENOS UN MATERIAL CON MOVIMIENTOS
  this.puedeDeshacer = resp.archivos.some(
    m => m.entradas > 0 || m.salidas > 0
  );


      this.totalItems = resp.totalItems;
      this.totalPages = resp.totalPages;
      this.currentPage = resp.currentPage;

      this.noRecordsFound = resp.archivos.length === 0;
      this.cargando = false;
    },
    error: err => {
      console.error(err);
      this.materiales = [];
      this.materialesFiltrados = [];
      this.noRecordsFound = true;
      this.cargando = false;
    }
  });
}


  // ================= PAGINACIÓN =================
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.consultarBackend();
    }
  }

  goToFirstPage(): void {
    this.currentPage = 1;
    this.consultarBackend();
  }

  goToLastPage(): void {
    this.currentPage = this.totalPages;
    this.consultarBackend();
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.consultarBackend();
    }
  }

  onItemsPerPageChange(): void {
  this.currentPage = 1;
  if (this.itemsPerPage === -1) {
    this.totalPages = 1;
  }
  this.consultarBackend();
}

  // ================= LIMPIAR =================
  onLimpiar(): void {
    this.trackingId = '';
    this.selectedYear = '';
    this.selectedMonth = '';
    this.selectedStatus = '';
    this.startDate = '';
    this.endDate = '';
    this.data = [];
    this.hasSearched = false;
    this.noRecordsFound = false;
  }
  onTrackingIdChange(): void {
    this.isTrackingIdEntered = !!this.trackingId;
  }

deshacerMovimiento(): void {
  if (!this.materialSeleccionadoId) return;

  this.materialService
    .eliminarUltimoMovimiento(this.materialSeleccionadoId)
    .subscribe({
      next: () => {
        this.mensajeModal = 'Último movimiento deshecho';
        this.modalMensajeVisible = true;
        this.consultarBackend();
      },
      error: () => {
        this.mensajeModal = 'Error al deshacer movimiento';
        this.modalMensajeVisible = true;
      }
    });
}

get hayMovimiento(): boolean {
  return this.movimiento.cantidad > 0;
}


}
