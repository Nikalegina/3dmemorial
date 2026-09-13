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

  if (project.bench.enabled && project.table.enabled && project.bench.side === project.table.side) {
    diagnostics.push({
      severity: project.plot.widthM < 2.2 ? 'error' : 'warning',
      code: 'FURNITURE_SAME_SIDE',
      message: 'Лавка и стол выбраны с одной стороны. Перенесите один элемент или проверьте свободное место.',
    })
  }

  if (project.bench.enabled && project.table.enabled && project.plot.widthM < 1.8) {
    diagnostics.push({
      severity: 'warning',
      code: 'FURNITURE_TIGHT_FIT',
      message: 'Для лавки и стола одновременно участок может быть слишком узким.',
    })
  }

  if (project.vase.enabled && project.vase.placement === 'pair' && project.monument.widthM < 0.55) {
    diagnostics.push({
      severity: 'warning',
      code: 'VASE_PAIR_TIGHT',
      message: 'Для двух ваз основание памятника может быть слишком узким.',
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

  if (project.border.enabled && !project.paving.enabled) {
    diagnostics.push({
      severity: 'info',
      code: 'BORDER_WITHOUT_PAVING',
      message: 'Бордюр включён без покрытия — проверьте, соответствует ли это выбранному варианту благоустройства.',
    })
  }

  return diagnostics
}
