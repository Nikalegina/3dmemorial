import type { MemorialProject } from './memorialProject'

export interface ProjectDiagnostic {
  severity: 'info' | 'warning' | 'error'
  code: string
  message: string
}

export function validateProjectCompatibility(project: MemorialProject): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = []

  if (project.monument.widthM > project.plot.widthM * 0.72) {
    diagnostics.push({
      severity: 'error',
      code: 'MONUMENT_TOO_WIDE_FOR_PLOT',
      message: 'Ширина памятника слишком велика для указанного участка.',
    })
  }

  if (project.bench.enabled && project.table.enabled && project.plot.widthM < 1.8) {
    diagnostics.push({
      severity: 'warning',
      code: 'FURNITURE_TIGHT_FIT',
      message: 'Для лавки и стола одновременно участок может быть слишком узким.',
    })
  }

  if (project.monument.material === 'glass' && project.portrait.mode === 'engraving') {
    diagnostics.push({
      severity: 'info',
      code: 'GLASS_ENGRAVING_PREVIEW',
      message: 'Для стекла рекомендуется сравнить гравировку с цветной фотопечатью.',
    })
  }

  if (!project.paving.enabled && project.plinth.enabled) {
    diagnostics.push({
      severity: 'info',
      code: 'PLINTH_WITHOUT_PAVING',
      message: 'Цоколь показан без дополнительного покрытия участка.',
    })
  }

  return diagnostics
}
