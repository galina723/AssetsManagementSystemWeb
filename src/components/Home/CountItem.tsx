import { Card, CardContent, Typography } from "@mui/material";

const CountItem = ({
  title,
  count,
  color,
}: {
  title: string;
  count: number;
  color: string;
}) => {
  return (
    <Card
      sx={{
        backgroundColor: "#fff",
        borderLeft: `6px solid ${color}`,
        borderRadius: 2,
        width: "100%",
      }}
    >
      <CardContent>
        <Typography variant="subtitle1" color="text.secondary">
          {title}
        </Typography>
        <Typography variant="h5" fontWeight="bold">
          {count}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CountItem;
