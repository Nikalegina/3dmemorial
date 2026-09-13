import { getCompositionWidth, getVisibleSteles, type MemorialProject } from './memorialProject'

export interface ProjectDiagnostic {
  severity: 'info' | 'warning' | 'error'
  code: string
  message: string
}

export function validateProjectCompatibility(project: MemorialProject): ProjectDiagnostic[] {
  const diagnostics: ProjectDiagnostic[] = []
  const visibleSteles = getVisibleSteles(project)
  const compositionWidth = getCompositionWidth(project)

  if (compositionWidth > project.plot.widthM * 0.82) {
    diagnostics.push({
      severity: 'error',
      code: 'COMPOSITION_TOO_WIDE_FOR_PLOT',
      message: 'Общая ширина композиции слишком велика для указанного участка.',
    })
  }

  if (project.layout.type === 'paired' && visibleSteles.length !== 2) {
    diagnostics.push({
      severity: 'error',
      code: 'PAIRED_LAYOUT_INCOMPLETE',
      message: 'Для парной композиции нужны две стелы.',
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

  if (project.vase.enabled && project.vase.placement === 'pair' && compositionWidth < 0.55) {
    diagnostics.push({
      severity: 'warning',
      code: 'VASE_PAIR_TIGHT',
      message: 'Для двух ваз основание композиции может быть слишком узким.',
    })
  }

  for (const stele of visibleSteles) {
    if (stele.monument.material === 'glass' && stele.portrait.mode === 'engraving') {
      diagnostics.push({
        severity: 'info',
        code: `GLASS_ENGRAVING_PREVIEW_${stele.id}`,
        message: 'Для стекла рекомендуется сравнить гравировку с цветной фотопечатью.',
      })
    }
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
