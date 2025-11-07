import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {
  transform(segundos: number): string {
    if (!segundos && segundos !== 0) return '-';
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = Math.floor(segundos % 60);
    const pad = (v: number) => v.toString().padStart(2, '0');
    return `${pad(horas)}:${pad(minutos)}:${pad(segs)}`;
  }
}
