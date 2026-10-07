import type { ReactNode } from 'react'

interface RadioGroupProps<T extends string> {
  legend: string
  /** Nombre común de los radios (agrupa el teclado y el lector de pantalla). */
  name: string
  options: readonly { value: T; label: ReactNode }[]
  value: T
  onChange: (value: T) => void
}

/** Grupo de opciones excluyentes de las pantallas de ajuste de la práctica (quiz de mástil y oído). */
export function RadioGroup<T extends string>({ legend, name, options, value, onChange }: RadioGroupProps<T>) {
  return (
    <fieldset className="quiz-options">
      <legend>{legend}</legend>
      {options.map((option) => (
        <label key={option.value}>
          <input type="radio" name={name} checked={value === option.value} onChange={() => onChange(option.value)} />{' '}
          {option.label}
        </label>
      ))}
    </fieldset>
  )
}
