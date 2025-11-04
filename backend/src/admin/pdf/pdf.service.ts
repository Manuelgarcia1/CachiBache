import { Injectable } from '@nestjs/common';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

// Configurar fuentes para pdfMake
(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || pdfFonts;

// Tipos personalizados para pdfmake
type TDocumentDefinitions = any;

export interface PdfExportFilters {
  startDate?: string;
  endDate?: string;
  status?: string[];
}

export interface ReportStatistics {
  totalReports: number;
  reportsByStatus: Record<string, number>;
  reportsBySeverity: Record<string, number>;
  activeReports: number;
  closedReports: number;
  resolutionRate: number;
}

@Injectable()
export class PdfService {
  constructor() {
    // Sin necesidad de canvas - usaremos solo tablas y estadísticas
  }

  /**
   * Genera el PDF con estadísticas y gráficos
   */
  async generateReportPdf(
    statistics: ReportStatistics,
    filters: PdfExportFilters,
  ): Promise<Buffer> {
    // Formatear fechas para el título
    const periodText = this.formatPeriodText(filters);

    // Definir estructura del documento PDF
    const docDefinition: TDocumentDefinitions = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      header: {
        margin: [40, 20, 40, 0],
        columns: [
          {
            text: 'CACHI BACHE',
            style: 'header',
            alignment: 'left',
          },
          {
            text: new Date().toLocaleDateString('es-ES'),
            alignment: 'right',
            margin: [0, 5, 0, 0],
            fontSize: 10,
            color: '#666666',
          },
        ],
      },
      content: [
        // Título principal
        {
          text: 'INFORME DE REPORTES',
          style: 'title',
          margin: [0, 0, 0, 5],
        },
        {
          text: periodText,
          style: 'subtitle',
          margin: [0, 0, 0, 20],
        },

        // Separador
        {
          canvas: [
            {
              type: 'line',
              x1: 0,
              y1: 0,
              x2: 515,
              y2: 0,
              lineWidth: 2,
              lineColor: '#094b7e',
            },
          ],
          margin: [0, 0, 0, 20],
        },

        // Resumen Ejecutivo
        {
          text: '1. RESUMEN EJECUTIVO',
          style: 'sectionHeader',
          margin: [0, 0, 0, 10],
        },
        {
          columns: [
            {
              width: '50%',
              stack: [
                {
                  text: 'Total de Reportes',
                  fontSize: 10,
                  color: '#666666',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: statistics.totalReports.toString(),
                  fontSize: 24,
                  bold: true,
                  color: '#094b7e',
                  margin: [0, 0, 0, 10],
                },
              ],
            },
            {
              width: '50%',
              stack: [
                {
                  text: 'Tasa de Resolución',
                  fontSize: 10,
                  color: '#666666',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: `${statistics.resolutionRate.toFixed(1)}%`,
                  fontSize: 24,
                  bold: true,
                  color: '#10b981',
                  margin: [0, 0, 0, 10],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 15],
        },
        {
          columns: [
            {
              width: '50%',
              stack: [
                {
                  text: 'Reportes Activos',
                  fontSize: 10,
                  color: '#666666',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: statistics.activeReports.toString(),
                  fontSize: 20,
                  bold: true,
                  color: '#f59e0b',
                  margin: [0, 0, 0, 10],
                },
              ],
            },
            {
              width: '50%',
              stack: [
                {
                  text: 'Reportes Cerrados',
                  fontSize: 10,
                  color: '#666666',
                  margin: [0, 0, 0, 3],
                },
                {
                  text: statistics.closedReports.toString(),
                  fontSize: 20,
                  bold: true,
                  color: '#6b7280',
                  margin: [0, 0, 0, 10],
                },
              ],
            },
          ],
          margin: [0, 0, 0, 25],
        },

        // Distribución por Estado
        {
          text: '2. DISTRIBUCIÓN POR ESTADO',
          style: 'sectionHeader',
          margin: [0, 10, 0, 10],
        },
        this.generateStatusTable(
          statistics.reportsByStatus,
          statistics.totalReports,
        ),

        // Distribución por Severidad
        {
          text: '3. DISTRIBUCIÓN POR SEVERIDAD',
          style: 'sectionHeader',
          margin: [0, 20, 0, 10],
        },
        this.generateSeverityTable(
          statistics.reportsBySeverity,
          statistics.totalReports,
        ),

        // Footer info
        {
          text: `Informe generado el ${new Date().toLocaleString('es-ES')}`,
          alignment: 'center',
          margin: [0, 30, 0, 0],
          fontSize: 9,
          color: '#999999',
          italics: true,
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          color: '#094b7e',
        },
        title: {
          fontSize: 22,
          bold: true,
          alignment: 'center',
          color: '#094b7e',
        },
        subtitle: {
          fontSize: 12,
          alignment: 'center',
          color: '#666666',
          italics: true,
        },
        sectionHeader: {
          fontSize: 14,
          bold: true,
          color: '#094b7e',
        },
        tableHeader: {
          bold: true,
          fontSize: 11,
          color: 'white',
          fillColor: '#094b7e',
        },
      },
      defaultStyle: {
        fontSize: 10,
        lineHeight: 1.3,
      },
    };

    // Generar PDF
    return new Promise<Buffer>((resolve) => {
      const pdfDocGenerator = pdfMake.createPdf(docDefinition);
      pdfDocGenerator.getBuffer((buffer: Buffer) => {
        resolve(buffer);
      });
    });
  }

  /**
   * Formatea el texto del período para el PDF
   */
  private formatPeriodText(filters: PdfExportFilters): string {
    if (filters.startDate && filters.endDate) {
      const start = new Date(filters.startDate).toLocaleDateString('es-ES');
      const end = new Date(filters.endDate).toLocaleDateString('es-ES');
      return `Período: ${start} - ${end}`;
    }
    return 'Todos los reportes';
  }

  /**
   * Genera tabla de distribución por estado con barras de progreso
   */
  private generateStatusTable(
    reportsByStatus: Record<string, number>,
    totalReports: number,
  ) {
    const statusLabels = {
      PENDIENTE: 'Pendiente',
      EN_REPARACION: 'En Reparación',
      RESUELTO: 'Resuelto',
      DESCARTADO: 'Descartado',
    };

    const statusColors = {
      PENDIENTE: '#f59e0b',
      EN_REPARACION: '#3b82f6',
      RESUELTO: '#10b981',
      DESCARTADO: '#ef4444',
    };

    const rows = Object.entries(reportsByStatus).map(([status, count]) => {
      const percentage = totalReports > 0 ? (count / totalReports) * 100 : 0;

      return [
        {
          text: statusLabels[status] || status,
          bold: true,
        },
        {
          text: count.toString(),
          alignment: 'center',
          fontSize: 11,
        },
        {
          text: `${percentage.toFixed(1)}%`,
          alignment: 'center',
          fontSize: 11,
          color: statusColors[status] || '#666666',
          bold: true,
        },
      ];
    });

    return {
      table: {
        headerRows: 1,
        widths: ['*', 80, 80],
        body: [
          [
            { text: 'Estado', style: 'tableHeader' },
            { text: 'Cantidad', style: 'tableHeader', alignment: 'center' },
            { text: 'Porcentaje', style: 'tableHeader', alignment: 'center' },
          ],
          ...rows,
        ],
      },
      margin: [0, 0, 0, 15],
      layout: {
        fillColor: function (rowIndex) {
          return rowIndex === 0 ? null : rowIndex % 2 === 0 ? '#f9fafb' : null;
        },
        hLineWidth: function (i, node) {
          return i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5;
        },
        vLineWidth: function () {
          return 0.5;
        },
        hLineColor: function (i, node) {
          return i === 0 || i === 1 || i === node.table.body.length
            ? '#094b7e'
            : '#e5e7eb';
        },
        vLineColor: function () {
          return '#e5e7eb';
        },
      },
    };
  }

  /**
   * Genera tabla de distribución por severidad con barras de progreso
   */
  private generateSeverityTable(
    reportsBySeverity: Record<string, number>,
    totalReports: number,
  ) {
    const severityLabels = {
      LEVE: 'Leve',
      INTERMEDIO: 'Intermedio',
      GRAVE: 'Grave',
    };

    const severityColors = {
      LEVE: '#10b981',
      INTERMEDIO: '#f59e0b',
      GRAVE: '#ef4444',
    };

    const rows = Object.entries(reportsBySeverity).map(([severity, count]) => {
      const percentage = totalReports > 0 ? (count / totalReports) * 100 : 0;

      return [
        {
          text: severityLabels[severity] || severity,
          bold: true,
        },
        {
          text: count.toString(),
          alignment: 'center',
          fontSize: 11,
        },
        {
          text: `${percentage.toFixed(1)}%`,
          alignment: 'center',
          fontSize: 11,
          color: severityColors[severity] || '#666666',
          bold: true,
        },
      ];
    });

    return {
      table: {
        headerRows: 1,
        widths: ['*', 80, 80],
        body: [
          [
            { text: 'Severidad', style: 'tableHeader' },
            { text: 'Cantidad', style: 'tableHeader', alignment: 'center' },
            { text: 'Porcentaje', style: 'tableHeader', alignment: 'center' },
          ],
          ...rows,
        ],
      },
      margin: [0, 0, 0, 15],
      layout: {
        fillColor: function (rowIndex) {
          return rowIndex === 0 ? null : rowIndex % 2 === 0 ? '#f9fafb' : null;
        },
        hLineWidth: function (i, node) {
          return i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5;
        },
        vLineWidth: function () {
          return 0.5;
        },
        hLineColor: function (i, node) {
          return i === 0 || i === 1 || i === node.table.body.length
            ? '#094b7e'
            : '#e5e7eb';
        },
        vLineColor: function () {
          return '#e5e7eb';
        },
      },
    };
  }
}
