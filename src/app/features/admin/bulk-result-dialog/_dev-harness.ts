import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BulkResultDialogComponent } from './bulk-result-dialog';
import { BulkUploadResult } from '../user-admin.service';

/** TEMPORAL: harness de desarrollo para inspeccionar visualmente el diálogo. */
@Component({
  selector: 'eci-dev-dialog-harness',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [BulkResultDialogComponent],
  template: `<eci-bulk-result-dialog [result]="result" />`,
})
export class DevDialogHarness {
  protected readonly result: BulkUploadResult = {
    total: 5,
    creados: 2,
    usuarios: [
      { email: 'ana.diaz@escuelaing.edu.co', nombre: 'Ana', apellido: 'Díaz', rol: 'estudiante', passwordTemporal: 'Temp-1234' },
      { email: 'beto.ruiz@escuelaing.edu.co', nombre: 'Beto', apellido: 'Ruiz', rol: 'tutor', passwordTemporal: 'Temp-5678' },
    ],
    errores: [
      { fila: 2, email: 'dana.diaz@escuelaing.edu.co', motivo: 'email_ya_existe' },
      { fila: 3, email: 'luisa.pena@escuelaing.edu.co', motivo: 'email_ya_existe' },
      { fila: 4, email: 'juanaa.lozano-c@escuelaing.edu.co', motivo: 'email_ya_existe' },
    ],
  };
}
