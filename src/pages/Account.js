import React, { useState, useEffect } from "react";
import { useAuth } from "../components/AuthProvider.js";
import supabase from "../services/supabase";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";
import * as d3 from "d3";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMoneyBill,
  faChartLine,
  faSackDollar,
} from "@fortawesome/free-solid-svg-icons";
ChartJS.register(ArcElement, Tooltip, Legend);

const addCommas = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const Account = () => {
  const [data, setData] = useState([]);
  const [cash, setCash] = useState(0);
  const [sectors, setSectors] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      console.log(user.identities[0].identity_data.username);
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

        const parsed_data = JSON.parse(nodes[0].portfolio);

        setCash(
          parsed_data.find((item) => item.Symbol === "CUR:USD")?.value || 0
        );

        setData(parsed_data.filter((item) => item.Symbol !== "CUR:USD"));
        setSectors([...new Set(data.map((item) => item.sector || "Other"))]);
      }
    })();
  }, [user]);

  const getSectorColor = (sector) => {
    const index = sectors.indexOf(sector);
    return `hsl(${index * 30}, 70%, 50%)`;
  };

  const aggregateBySector = data.reduce((acc, item) => {
    const sector = item.sector || "Other";
    if (!acc[sector]) {
      acc[sector] = 0;
    }
    acc[sector] += item.value;
    return acc;
  }, {});

  const sectors_labels = Object.keys(aggregateBySector);
  const sectorValues = Object.values(aggregateBySector);

  // Calculate data for numerical cards
  const overallPortfolioValue =
    data.reduce((acc, item) => acc + item.value, 0) + cash;

  const topGainer = data.reduce(
    (prev, current) => (prev.value > current.value ? prev : current),
    data[0] || { Company: "N/A", value: 0 }
  );

  // Prepare data for pie chart
  const pieData = {
    labels: sectors_labels,
    datasets: [
      {
        data: sectorValues,
        backgroundColor: sectors_labels.map((sector) => getSectorColor(sector)),
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
    const height = 500;
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
          <div
            className="p-4 text-white rounded-md w-1/3"
            style={{
              backgroundColor: "#1D1D1F",
            }}>
            <div className="mb-2 flex flex-row gap-2 items-center">
              <FontAwesomeIcon icon={faMoneyBill} />
              <h3 className="text-xl">Portfolio Value</h3>
            </div>

            <p className="text-4xl">
              ${addCommas(overallPortfolioValue.toFixed(2))}
            </p>
          </div>

          <div
            className="p-4 text-white rounded-md w-1/3"
            style={{
              backgroundColor: "#5FE78F",
            }}>
            <div className="mb-2 flex flex-row gap-2 items-center">
              <FontAwesomeIcon icon={faChartLine} />
              <h3 className="text-xl">Top Gainer</h3>
            </div>
            <p className="text-lg">{topGainer.Company}</p>
            <p className="text-xl">${addCommas(topGainer.value.toFixed(2))}</p>
          </div>
          <div
            className="p-4 text-white rounded-md w-1/3"
            style={{
              backgroundColor: "#b6c8d9",
            }}>
            <div className="mb-2 flex flex-row gap-2 items-center">
              <FontAwesomeIcon icon={faSackDollar} />
              <h3 className="text-xl">Cash Balance</h3>
            </div>
            <p className="text-2xl">${cash.toFixed(2)}</p>
          </div>
        </div>
        <div className="p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl mb-4">Portfolio Allocation</h3>
          {renderTreemap(treeData)}
        </div>
      </div>
      <div className="w-full md:w-1/3">
        <div className="p-4 bg-gray-100 rounded-md">
          <h3 className="text-xl mb-4">Sector Holdings</h3>
          <Pie data={pieData} />
        </div>
      </div>
    </div>
  );
};

export default Account;
