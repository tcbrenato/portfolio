// Export Excel et PDF de la liste filtrée (modules chargés uniquement au premier usage)
import { aujourdhui, formaterDate } from './dates'
import { STATUTS, delai, estEchue, estTerminee } from './statuts'

function lignes(taches, profilsParId, jour) {
  return taches.map((t) => ({
    numero: t.numero,
    intitule: t.intitule,
    date: formaterDate(t.date_creation),
    echeance: t.echeance ? formaterDate(t.echeance) : '',
    attributaires: t.attribues.map((id) => profilsParId[id]?.nom_complet).filter(Boolean).join(', '),
    statut: STATUTS[t.statut]?.libelle || t.statut,
    delai: delai(t, jour).texte,
    priorite: t.priorite === 'haute' ? 'Haute' : 'Normale',
    description: t.description || '',
    echue: estEchue(t, jour),
    terminee: estTerminee(t)
  }))
}

function nomFichier(extension) {
  return `Agenda-CRF-Perfection_${aujourdhui()}.${extension}`
}

export async function exporterExcel(taches, profilsParId, sousTitre = '') {
  const { default: writeExcelFile } = await import('write-excel-file/browser')
  const jour = aujourdhui()
  const entete = ['N°', 'Tâche', 'Date', 'Échéance', 'Attributaire(s)', 'Statut', 'Délai', 'Priorité', 'Description']
  const styleEntete = { fontWeight: 'bold', backgroundColor: '#1B2A41', textColor: '#FFFFFF', alignVertical: 'center', height: 22 }
  const donnees = [
    [{ value: 'Agenda CRF Perfection — Suivi des tâches', fontWeight: 'bold', fontSize: 14, textColor: '#1B2A41', columnSpan: 9 }, null, null, null, null, null, null, null, null],
    [{ value: `${sousTitre ? sousTitre + ' — ' : ''}Édité le ${formaterDate(jour)} — ${taches.length} tâche(s)`, textColor: '#5B6576', columnSpan: 9 }, null, null, null, null, null, null, null, null],
    [],
    entete.map((v) => ({ value: v, ...styleEntete })),
    ...lignes(taches, profilsParId, jour).map((l) => {
      const style = l.echue ? { textColor: '#C8202F' } : l.terminee ? { textColor: '#8A93A3' } : {}
      return [
        { value: l.numero, type: Number, align: 'center' },
        { value: l.intitule, wrap: true, ...style, ...(l.terminee ? { textDecoration: { strikethrough: true } } : {}) },
        { value: l.date },
        { value: l.echeance, ...style },
        { value: l.attributaires, wrap: true },
        { value: l.statut },
        { value: l.delai, ...style, ...(l.echue ? { fontWeight: 'bold' } : {}) },
        { value: l.priorite },
        { value: l.description, wrap: true }
      ]
    })
  ]
  await writeExcelFile(donnees, {
    columns: [{ width: 7 }, { width: 48 }, { width: 12 }, { width: 12 }, { width: 30 }, { width: 12 }, { width: 18 }, { width: 10 }, { width: 50 }],
    sheet: 'Tâches',
    stickyRowsCount: 4,
    orientation: 'landscape',
    fontFamily: 'Calibri',
    fontSize: 11
  }).toFile(nomFichier('xlsx'))
}

async function imageEnDataUrl(url) {
  try {
    const reponse = await fetch(url)
    const blob = await reponse.blob()
    return await new Promise((ok) => {
      const lecteur = new FileReader()
      lecteur.onload = () => ok(lecteur.result)
      lecteur.onerror = () => ok(null)
      lecteur.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

export async function exporterPDF(taches, profilsParId, sousTitre = '') {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import('jspdf'), import('jspdf-autotable')])
  const jour = aujourdhui()
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
  const largeur = doc.internal.pageSize.getWidth()

  const logo = await imageEnDataUrl('/logo-entete.png')
  if (logo) doc.addImage(logo, 'PNG', 14, 9, 16, 16)
  doc.setTextColor(27, 42, 65)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(15)
  doc.text('Agenda CRF Perfection — Suivi des tâches', logo ? 34 : 14, 16)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9.5)
  doc.setTextColor(91, 101, 118)
  doc.text(`${sousTitre ? sousTitre + '   ·   ' : ''}Édité le ${formaterDate(jour)}   ·   ${taches.length} tâche(s)`, logo ? 34 : 14, 22)
  doc.setDrawColor(150, 17, 28)
  doc.setLineWidth(0.8)
  doc.line(14, 28, largeur - 14, 28)

  const donnees = lignes(taches, profilsParId, jour)
  autoTable(doc, {
    startY: 32,
    head: [['N°', 'Tâche', 'Date', 'Échéance', 'Attributaire(s)', 'Statut', 'Délai']],
    body: donnees.map((l) => [l.numero, l.intitule + (l.priorite === 'Haute' && !l.terminee ? '  (priorité haute)' : ''), l.date, l.echeance || '—', l.attributaires || '—', l.statut, l.delai]),
    styles: { font: 'helvetica', fontSize: 9, cellPadding: 2.2, textColor: [27, 42, 65], lineColor: [227, 230, 235], lineWidth: 0.2, valign: 'middle' },
    headStyles: { fillColor: [27, 42, 65], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [247, 248, 250] },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center', fontStyle: 'bold' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 22 },
      3: { cellWidth: 22 },
      4: { cellWidth: 52 },
      5: { cellWidth: 22 },
      6: { cellWidth: 30 }
    },
    didParseCell: (d) => {
      if (d.section !== 'body') return
      const l = donnees[d.row.index]
      if (l.echue && (d.column.index === 3 || d.column.index === 6)) {
        d.cell.styles.textColor = [200, 32, 47]
        d.cell.styles.fontStyle = 'bold'
      }
      if (l.terminee) d.cell.styles.textColor = [138, 147, 163]
    },
    didDrawPage: () => {
      const hauteur = doc.internal.pageSize.getHeight()
      doc.setFontSize(8)
      doc.setTextColor(138, 147, 163)
      doc.text('CRF Perfection — document interne', 14, hauteur - 8)
      doc.text(`Page ${doc.getCurrentPageInfo().pageNumber}`, largeur - 14, hauteur - 8, { align: 'right' })
    }
  })
  doc.save(nomFichier('pdf'))
}
