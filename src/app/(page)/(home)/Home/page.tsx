import CountItem from "@/components/Home/CountItem";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart } from "@mui/x-charts/PieChart";

function createData(
  name: string,
  total: number,
  unit: string,
  status: string,
  note: string
) {
  return { name, total, unit, status, note };
}

const HomePage = () => {
  const rows = [
    createData("Paper", 15, "Piece", "Using", ""),
    createData("Macbook Pro", 1, "Piece", "Fixing", ""),
    createData("iMac M4", 15, "Piece", "Using", ""),
    createData("Laptop Dell", 1, "Piece", "Using", ""),
    createData("Projector", 1, "Piece", "Warehouse", ""),
  ];

  return (
    <div className="home-page">
      <div className="home-page__section-1">
        <CountItem title="Assets" count={75} color="red" />
        <CountItem title="Warehouse" count={30} color="green" />
        <CountItem title="Using" count={60} color="blue" />
        <CountItem title="Fixing" count={15} color="orange" />
      </div>
      <div className="home-page__section-2">
        <div className="home-page__section-2__selection-1">
          <div className="home-page__section-2__selection-1__title">
            Assets data
          </div>
          <BarChart
            xAxis={[{ data: ["group A", "group B", "group C"] }]}
            series={[
              { data: [4, 3, 5] },
              { data: [1, 6, 3] },
              { data: [2, 5, 6] },
            ]}
            height={300}
          />
        </div>
        <div className="home-page__section-2__selection-1 home-page__section-2__selection-2">
          <div className="home-page__section-2__selection-1__title">
            Warehouse data
          </div>
          <PieChart
            series={[
              {
                data: [
                  { id: 0, value: 10, label: "series A" },
                  { id: 1, value: 15, label: "series B" },
                  { id: 2, value: 20, label: "series C" },
                ],
              },
            ]}
            height={300}
          />
        </div>
      </div>
      <div className="home-page__section-3">
        <div className="home-page__section-2__selection-1__title">
          Assets data
        </div>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Assets name</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Unit</TableCell>
                <TableCell align="right">Status</TableCell>
                <TableCell align="right">Note</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.total}</TableCell>
                  <TableCell align="right">{row.unit}</TableCell>
                  <TableCell align="right">{row.status}</TableCell>
                  <TableCell align="right">{row.note}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
};

export default HomePage;
