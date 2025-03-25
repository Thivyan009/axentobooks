import { Document, Page, Text, View, StyleSheet, PDFViewer } from "@react-pdf/renderer"
import { format } from "date-fns"
import type { ProfitLossStatement } from "@/lib/types/ai"
import { formatCurrency } from "@/lib/utils/currency"

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 10,
    backgroundColor: "#f3f4f6",
    padding: 8,
  },
  table: {
    display: "table",
    width: "100%",
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 25,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#f9fafb",
  },
  tableCell: {
    flex: 1,
    padding: 5,
  },
  amountCell: {
    flex: 1,
    padding: 5,
    textAlign: "right",
  },
  total: {
    fontWeight: "bold",
  },
  summary: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f9fafb",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  analysis: {
    marginTop: 20,
  },
  list: {
    marginLeft: 10,
  },
  listItem: {
    marginBottom: 5,
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    color: "#666",
    fontSize: 10,
  },
})

interface PLFDocumentProps {
  statement: ProfitLossStatement
}

export function PLFDocument({ statement }: PLFDocumentProps) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profit & Loss Statement</Text>
          <Text style={styles.subtitle}>
            Period: {format(new Date(statement.periodStart), "MMMM d, yyyy")} to{" "}
            {format(new Date(statement.periodEnd), "MMMM d, yyyy")}
          </Text>
        </View>

        {/* Revenue Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Revenue</Text>
          <View style={styles.table}>
            {statement.revenue.map((rev, i) => (
              <View key={i}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>{rev.category}</Text>
                  <Text style={styles.amountCell}>{formatCurrency(rev.amount)}</Text>
                </View>
                {rev.items.map((item, j) => (
                  <View key={j} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.description}</Text>
                    <Text style={styles.amountCell}>{formatCurrency(item.amount)}</Text>
                  </View>
                ))}
              </View>
            ))}
            <View style={[styles.tableRow, styles.total]}>
              <Text style={styles.tableCell}>Total Revenue</Text>
              <Text style={styles.amountCell}>{formatCurrency(statement.summary.totalRevenue)}</Text>
            </View>
          </View>
        </View>

        {/* Expenses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Expenses</Text>
          <View style={styles.table}>
            {statement.expenses.map((exp, i) => (
              <View key={i}>
                <View style={[styles.tableRow, styles.tableHeader]}>
                  <Text style={styles.tableCell}>{exp.category}</Text>
                  <Text style={styles.amountCell}>{formatCurrency(exp.amount)}</Text>
                </View>
                {exp.items.map((item, j) => (
                  <View key={j} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.description}</Text>
                    <Text style={styles.amountCell}>{formatCurrency(item.amount)}</Text>
                  </View>
                ))}
              </View>
            ))}
            <View style={[styles.tableRow, styles.total]}>
              <Text style={styles.tableCell}>Total Expenses</Text>
              <Text style={styles.amountCell}>{formatCurrency(statement.summary.totalExpenses)}</Text>
            </View>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.summaryRow}>
            <Text>Net Profit/Loss</Text>
            <Text>{formatCurrency(statement.summary.netProfitLoss)}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Profit Margin</Text>
            <Text>{statement.summary.profitMargin.toFixed(1)}%</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text>Month-over-Month Growth</Text>
            <Text>{statement.summary.monthOverMonthGrowth.toFixed(1)}%</Text>
          </View>
        </View>

        {/* Analysis Section */}
        <View style={styles.analysis}>
          <Text style={styles.sectionTitle}>Analysis & Insights</Text>
          <View style={styles.section}>
            <Text style={styles.tableCell}>Key Insights:</Text>
            <View style={styles.list}>
              {statement.analysis.insights.map((insight, i) => (
                <Text key={i} style={styles.listItem}>
                  • {insight}
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.tableCell}>Recommendations:</Text>
            <View style={styles.list}>
              {statement.analysis.recommendations.map((rec, i) => (
                <Text key={i} style={styles.listItem}>
                  • {rec}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Footer */}
        <Text style={styles.footer}>Generated by Axento Books on {format(new Date(), "MMMM d, yyyy 'at' h:mm a")}</Text>
      </Page>
    </Document>
  )
}

interface PLFViewerProps {
  statement: ProfitLossStatement
}

export function PLFViewer({ statement }: PLFViewerProps) {
  return (
    <PDFViewer className="h-[800px] w-full">
      <PLFDocument statement={statement} />
    </PDFViewer>
  )
}

