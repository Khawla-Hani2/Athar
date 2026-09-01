export type ClassValue = string | number | null | undefined | false | ClassValue[]

export function cn(...values: ClassValue[]): string {
  const result: string[] = []
  const walk = (v: ClassValue) => {
    if (!v) return
    if (Array.isArray(v)) {
      v.forEach(walk)
    } else {
      result.push(String(v))
    }
  }
  values.forEach(walk)
  return result.join(' ')
}
