import { describe, expect, it } from 'vitest'
import { addDays, dayKey, daysBetween, intervalForBox, isDue, schedule, type Outcome } from './leitner'

/** Fecha ISO de un día local (2026-10-dd) a una hora concreta. */
const at = (day: number, hour = 18, month = 10) => new Date(2026, month - 1, day, hour).toISOString()
const ok = (day: number, hour?: number): Outcome => ({ date: at(day, hour), ok: true })
const ko = (day: number, hour?: number): Outcome => ({ date: at(day, hour), ok: false })

describe('fechas', () => {
  it('dayKey usa la fecha local', () => {
    expect(dayKey(new Date(2026, 9, 1, 23, 30))).toBe('2026-10-01')
  })

  it('addDays cruza meses y años', () => {
    expect(addDays('2026-10-30', 3)).toBe('2026-11-02')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
  })

  it('daysBetween', () => {
    expect(daysBetween('2026-10-01', '2026-10-22')).toBe(21)
    expect(daysBetween('2026-10-05', '2026-10-01')).toBe(-4)
  })

  it('intervalForBox repite el último intervalo', () => {
    expect(intervalForBox(1)).toBe(1)
    expect(intervalForBox(4)).toBe(21)
    expect(intervalForBox(5)).toBe(21)
    expect(intervalForBox(2, [2, 5])).toBe(5)
  })
})

describe('schedule', () => {
  it('sin resultados no hay calendario', () => {
    expect(schedule([])).toBeNull()
  })

  it('el primer día va a la caja 1 y se repasa al día siguiente', () => {
    expect(schedule([ok(1)])).toEqual({ box: 1, due: '2026-10-02', lastDay: '2026-10-01' })
  })

  it('varios pases limpios el mismo día cuentan como uno', () => {
    expect(schedule([ok(1, 10), ok(1, 11), ok(1, 12)])?.box).toBe(1)
  })

  it('sube de caja al aprobar en la fecha de repaso', () => {
    const s = schedule([ok(1), ok(2), ok(5), ok(12)])
    expect(s).toEqual({ box: 4, due: '2026-11-02', lastDay: '2026-10-12' })
  })

  it('no pasa de la caja máxima', () => {
    const s = schedule([ok(1), ok(2), ok(5), ok(12), { date: at(2, 18, 11), ok: true }, { date: at(30, 18, 11), ok: true }])
    expect(s?.box).toBe(5)
  })

  it('practicar antes de tiempo no cambia la caja ni la fecha', () => {
    // Caja 2 el día 2 (repaso el 5); practicar el 3 y el 4 no cambia nada.
    expect(schedule([ok(1), ok(2), ok(3), ok(4)])).toEqual({ box: 2, due: '2026-10-05', lastDay: '2026-10-04' })
  })

  it('un día suspendido devuelve a la caja 1', () => {
    expect(schedule([ok(1), ok(2), ko(5)])).toEqual({ box: 1, due: '2026-10-06', lastDay: '2026-10-05' })
  })

  it('cuenta el último intento del día, aunque estén desordenados', () => {
    // Falla primero y luego lo saca limpio: el día cuenta como aprobado.
    expect(schedule([ok(1), ok(2, 20), ko(2, 9)])?.box).toBe(2)
  })

  it('suspender antes de la fecha también devuelve a la caja 1', () => {
    expect(schedule([ok(1), ok(2), ko(3)])?.box).toBe(1)
  })

  it('usa los intervalos de la lección', () => {
    expect(schedule([ok(1), ok(3)], [2, 10])).toEqual({ box: 2, due: '2026-10-13', lastDay: '2026-10-03' })
  })
})

describe('isDue', () => {
  it('toca el día de repaso y los siguientes', () => {
    const s = schedule([ok(1)])
    expect(isDue(s, '2026-10-01')).toBe(false)
    expect(isDue(s, '2026-10-02')).toBe(true)
    expect(isDue(s, '2026-10-09')).toBe(true)
    expect(isDue(null, '2026-10-09')).toBe(false)
  })
})
