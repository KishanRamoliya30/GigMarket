"use client";
import { useState, useEffect } from "react";
import {
  Box,
  Tabs,
  Tab,
  Typography,
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Card,
  CardContent,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Chip,
  TablePagination,
} from "@mui/material";
import { styled } from "@mui/system";
import CountUp from "react-countup";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const WEEKS = ["W1", "W2", "W3", "W4"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PageWrapper = styled(Box)(() => ({
  backgroundColor: "#FAFDFD",
  borderRadius: 16,
  padding: 24,
  minHeight: "100vh",
  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  width: "75%",
}));

// Common Table Component
function TransactionsTable({
  transactions = [], 
  pagination = false,
  page = 0,
  rowsPerPage = 5,
  onPageChange = () => {},
  onRowsPerPageChange = () => {},
}:{
  transactions: {
    status: string;
    date: string;
    amount: number;
    id: number;
  }[];
  pagination?: boolean;
  page?: number;
  rowsPerPage?: number;
  onPageChange?: (event: unknown, newPage: number) => void;
  onRowsPerPageChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const getStatusStyle = (status: string) => {
    return status === "Completed"
      ? { color: "#2E7D32", bg: "#E8F5E9" }
      : { color: "#EF6C00", bg: "#FFF3E0" };
  };

  const visibleRows = pagination
    ? transactions.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
    : transactions;

  return (
    <TableContainer component={Paper} sx={{ mb: 3 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {visibleRows.map((tx) => {
            const st = getStatusStyle(tx.status);
            return (
              <TableRow key={tx.id}>
                <TableCell>{tx.date}</TableCell>
                <TableCell>₹{tx.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={tx.status}
                    size="small"
                    sx={{
                      bgcolor: st.bg,
                      color: st.color,
                      fontWeight: 600,
                      fontSize: "12px",
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {pagination && (
        <TablePagination
          component="div"
          count={transactions.length}
          page={page}
          onPageChange={onPageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      )}
    </TableContainer>
  );
}

export default function EarningsPage() {
  const [tab, setTab] = useState(0);
  const [tier, setTier] = useState("All");
  const [period, setPeriod] = useState("yearly");
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [inProgressEarnings, setInProgressEarnings] = useState(0);
  const [chartData, setChartData] = useState<{name:string,earnings:number}[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<{
    id: number;
    date: string;
    amount: number;
    status: string;
  }[]>([]);

  // Pagination states
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const labels =
      period === "yearly" ? MONTHS : period === "monthly" ? WEEKS : DAYS;

    const apiData =
      period === "yearly"
        ? [
            { name: "Jan", earnings: 3000 },
            { name: "Mar", earnings: 1500 },
            { name: "May", earnings: 5000 },
          ]
        : period === "monthly"
          ? [
              { name: "W1", earnings: 1200 },
              { name: "W3", earnings: 900 },
            ]
          : [
              { name: "Mon", earnings: 300 },
              { name: "Wed", earnings: 800 },
              { name: "Sat", earnings: 500 },
            ];

    const mergedData = labels.map((label) => {
      const found = apiData.find((d) => d.name === label);
      return { name: label, earnings: found ? found.earnings : 0 };
    });

    setChartData(mergedData);
    setTotalEarnings(45230);
    setInProgressEarnings(8200);
    setRecentTransactions([
      { id: 1, date: "2025-08-01", amount: 1200, status: "Completed" },
      { id: 2, date: "2025-08-05", amount: 800, status: "Pending" },
      { id: 3, date: "2025-08-09", amount: 1500, status: "Completed" },
      { id: 4, date: "2025-08-10", amount: 2200, status: "Completed" },
      { id: 5, date: "2025-08-11", amount: 500, status: "Pending" },
      { id: 6, date: "2025-08-12", amount: 900, status: "Completed" },
    ]);
  }, [tier, period]);

  return (
    <PageWrapper>
      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        TabIndicatorProps={{ style: { backgroundColor: "#00B386" } }}
        sx={{
          mb: 3,
          "& .MuiTab-root": {
            textTransform: "none",
            fontWeight: 600,
            fontSize: 15,
            borderRadius: 3,
            px: 3,
            py: 1.2,
            mx: 0.5,
          },
          "& .Mui-selected": {
            color: "#00B386",
            backgroundColor: "#E8F5E9",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
          },
        }}
      >
        <Tab label="Dashboard" />
        <Tab label="Transactions" />
      </Tabs>

      {/* Dashboard */}
      {tab === 0 && (
        <>
          {/* Tier Filter */}
          <Box display="flex" justifyContent="flex-end" mb={3}>
            <Select
              size="small"
              value={tier}
              onChange={(e) => setTier(e.target.value)}
              sx={{ fontWeight: 600 }}
            >
              {["All", "Basic", "Advanced", "Expert"].map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* Earnings Cards */}
          <Grid container spacing={3} mb={4}>
            <Grid size={{xs: 12, md: 6}}>
              <Card sx={{ backgroundColor: "#E8F5E9", height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#2E7D32">
                    ₹
                    <CountUp
                      end={totalEarnings}
                      duration={1}
                      separator=","
                      preserveValue
                    />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid size={{xs: 12, md: 6}}>
              <Card sx={{ backgroundColor: "#FFF3E0", height: "100%" }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    In-Progress Earnings
                  </Typography>
                  <Typography variant="h4" fontWeight={700} color="#EF6C00">
                    ₹
                    <CountUp
                      end={inProgressEarnings}
                      duration={1}
                      separator=","
                      preserveValue
                    />
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Chart */}
          <Box mb={4}>
            <ToggleButtonGroup
              size="small"
              value={period}
              exclusive
              onChange={(_, val) => val && setPeriod(val)}
              sx={{
                mb: 2,
                "& .MuiToggleButton-root.Mui-selected": {
                  backgroundColor: "#E8F5E9",
                  color: "#2E7D32",
                },
              }}
            >
              <ToggleButton value="yearly">Yearly</ToggleButton>
              <ToggleButton value="monthly">Monthly</ToggleButton>
              <ToggleButton value="weekly">Weekly</ToggleButton>
            </ToggleButtonGroup>
            <ResponsiveContainer width="75%" height={250}>
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value) => [`₹${value}`, "Earnings"]}
                  contentStyle={{ fontSize: 12 }}
                  cursor={{ fill: "rgba(0, 179, 134, 0.05)" }}
                />
                <Bar
                  dataKey="earnings"
                  fill="#00B386"
                  radius={[4, 4, 0, 0]}
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>

          {/* Recent Transactions Header */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Typography variant="h6">Recent Transactions</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => setTab(1)}
              sx={{
                borderColor: "#00B386",
                color: "#00B386",
                fontWeight: 600,
                "&:hover": { borderColor: "#27692b", color: "#27692b" },
              }}
            >
              View All
            </Button>
          </Box>

          {/* Recent Transactions Table */}
          <TransactionsTable transactions={recentTransactions.slice(0, 3)} />
        </>
      )}

      {/* Transactions Tab */}
      {tab === 1 && (
        <>
          <Typography variant="h6" mb={2}>
            All Transactions
          </Typography>
          <TransactionsTable
            transactions={recentTransactions}
            pagination
            page={page}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </>
      )}
    </PageWrapper>
  );
}
