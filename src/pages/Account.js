import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider.js";
import supabase from "../services/supabase";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import * as d3 from "d3";

ChartJS.register(ArcElement, Tooltip, Legend);

const Account = () => {
  const [data, setData] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      console.log(user.id);
      const { data: nodes, error: nodeError } = await supabase
        .from("nodes")
        .select()
        .eq("id", user.id);

      if (nodeError) {
        console.error("Node Error:", nodeError);
      }
      if (nodes.length > 0) {
        console.log("portfolio");
        console.log(JSON.parse(nodes[0].portfolio));

        setData(JSON.parse(nodes[0].portfolio));
      } else {
        setData(null);
      }
    })();
  }, [user]);

  if (!data) {
    return <div>Loading...</div>;
  }

  // Calculate data for numerical cards
  const overallPortfolioValue = data.reduce((acc, item) => acc + item.value, 0);

  const topGainer = data.reduce(
    (prev, current) => (prev.value > current.value ? prev : current),
    data[0] || { Company: "N/A", value: 0 }
  );

  const cashBalance = data.find((item) => item.Symbol === "BTC")?.value || 0;

  // Prepare data for pie chart
  console.log(data);
  const pieData = {
    labels: data.map((item) => item.Company),
    datasets: [
      {
        data: data.map((item) => item.value),
        backgroundColor: data.map((_, index) => `hsl(${index * 30}, 70%, 50%)`),
      },
    ],
  };

  // Prepare data for treemap
  const treeData = {
    name: "Portfolio",
    children: data.map((item) => ({
      name: item.Company,
      value: item.port_allocation,
    })),
  };

  // Render the treemap
  const renderTreemap = (data) => {
    const width = 850;
    const height = 450;
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const treemapLayout = d3.treemap().size([width, height]).padding(1);

    const root = d3.hierarchy(data).sum((d) => d.value);

    treemapLayout(root);

    return (
      <svg width={width} height={height}>
        {root.leaves().map((leaf, index) => (
          <g key={index} transform={`translate(${leaf.x0},${leaf.y0})`}>
            <rect
              width={leaf.x1 - leaf.x0}
              height={leaf.y1 - leaf.y0}
              style={{ fill: color(index) }}
            />
            <text x={3} y={20} style={{ fill: "white", fontSize: "12px" }}>
              {leaf.data.name}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      <div className="flex flex-col gap-4 w-full md:w-2/3">
        <div className="flex gap-4">
          <div className="p-4 bg-blue-500 text-white rounded-md w-1/3">
            <h3 className="text-xl">Overall Portfolio Value</h3>
            <p className="text-2xl">${overallPortfolioValue.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-green-500 text-white rounded-md w-1/3">
            <h3 className="text-xl">Top Gainer</h3>
            <p className="text-2xl">{topGainer.Company}</p>
            <p className="text-xl">${topGainer.value.toFixed(2)}</p>
          </div>
          <div className="p-4 bg-yellow-500 text-white rounded-md w-1/3">
            <h3 className="text-xl">Cash Balance</h3>
            <p className="text-2xl">${cashBalance.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl mb-4">Sector Allocation Treemap</h3>
          {renderTreemap(treeData)}
        </div>
      </div>
      <div className="w-full md:w-1/3">
        <div className="p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl mb-4">Portfolio Holdings</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Account;
