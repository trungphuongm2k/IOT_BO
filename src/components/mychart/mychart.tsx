import { Chart } from "chart.js";
import { useState, useEffect } from "react";

interface LineGraphProps {
  data: number[];
  labels: string[];
  color?: string;
}

export default function LineGraph({
  data,
  labels,
  color = "rgba(0,0,255,1.0)",
}: LineGraphProps) {
  const [chart, setChart] = useState<Chart | null>(null);

  useEffect(() => {
    if (!chart) {
      const ctx = document.getElementById(
        "myChart"
      ) as HTMLCanvasElement | null;
      if (!ctx) return;
      setChart(
        new Chart(ctx, {
          type: "line",
          data: {
            labels: labels,
            datasets: [
              {
                label: "Data",
                data: data,
                fill: false,
                borderColor: color,
                tension: 0.1,
              },
            ],
          },
          options: {
            scales: {},
          },
        })
      );
    } else {
      chart.data.datasets[0].data = data;
      chart.data.labels = labels;
      chart.update();
    }
  }, [data, labels, color, chart]);

  return (
    <canvas id="myChart" style={{ width: "100%", height: "400px" }}></canvas>
  );
}
