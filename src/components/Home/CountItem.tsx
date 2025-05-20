import React, { FC } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

interface Props {
  title: string;
  count: number;
  color: string;
}

const CountItem: FC<Props> = (props) => {
  const { title, count, color } = props;

  return (
    <div className="home-count-item">
      <div className="home-count-item__title">{title}</div>
      <div className="home-count-item__group">
        <div className="home-count-item__group__number">{count}</div>
        <div className="home-count-item__group__chart">
          <PieChart
            series={[
              {
                data: [{ value: count, color: color }],
                innerRadius: 30,
                outerRadius: 20,
                paddingAngle: 5,
                cornerRadius: 5,
                startAngle: -45,
                endAngle: 225,
                cx: 25,
                cy: 25,
              },
            ]}
            width={70}
            height={70}
          />
        </div>
      </div>
    </div>
  );
};

export default CountItem;
