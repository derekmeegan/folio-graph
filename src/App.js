import React, { useRef, useEffect, useState, useMemo } from "react";
import { ForceGraph2D } from "react-force-graph";
import myData from "./data/d.json";

const Home = ({ user }) => {
  console.log(user);
  const forceRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  useEffect(() => {
    forceRef.current.zoom(0.05);
    forceRef.current.centerAt(0, 0);
    forceRef.current.d3Force("charge").strength(-40000);
    forceRef.current.d3Force("link").distance(2000);
  }, []);

  const handleNodeClick = (node) => {
    if (forceRef.current) {
      forceRef.current.centerAt(node.x, node.y, 500);
      forceRef.current.zoom(0.25, 500);
      setSelectedNode(node);
    }
  };
  const createCompanyProfile = (node) => {
    const companyInfo = JSON.parse(node.info)[0];
    return (
      <div className="pt-3 pb-3 pl-2 pr-2">
        <div className="flex flex-row gap-3 mb-3">
          <img src={companyInfo.image} alt={node.id} width="40" height="40" />
          <p style={{ fontSize: "24px" }}>{companyInfo.Company}</p>
        </div>
        <div className="flex flex-row gap-2 text-sm mb-3">
          {[companyInfo.sector, companyInfo.exchangeShortName].map((item) => {
            return (
              <div className="border border-black rounded-md border-2 p-1">
                {item}
              </div>
            );
          })}
        </div>
        <div class="grid grid-cols-10 gap-4">
          <div class="col-span-6 bg-blue-200 p-4">
            {companyInfo.description}
          </div>
          <div class="col-span-4 bg-red-200 p-4">
            {[
              node.investors,
              node.market_cap,
              companyInfo.beta,
              companyInfo.volAvg,
            ].map((item, index) => {
              let names = ["Investors", "Market Cap", "Beta", "Avg Vol"];
              return (
                <div className="flex flex-col items-center border border-black mb-3 rounded-md border-2 p-1">
                  <div>{item}</div>
                  <div>{names[index]}</div>
                </div>
              );
            })}
          </div>
        </div>
        {/* <div>{node.info}</div> */}
      </div>
    );
  };

  const createPortfolioProfile = (node, user) => {
    const portfolio = JSON.parse(node.portfolio);
    return (
      <div className="pt-3 pb-3 pl-2 pr-2">
        <div style={{ fontSize: "24px" }} className="mb-2">
          {node.id}
        </div>
        <table className="stockTable">
          <thead>
            <tr>
              <th>Company</th>
              <th>Symbol</th>
              {user ? (
                <>
                  <th>Shares</th>
                  <th>Value</th>
                </>
              ) : (
                <th>Allocation</th>
              )}
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock, index) => (
              <tr key={index}>
                <td>{stock.Company}</td>
                <td>{stock.Symbol}</td>
                {user ? (
                  <>
                    <td>{stock.shares.toFixed(4)}</td>
                    <td>${stock.value.toFixed(2)}</td>
                  </>
                ) : (
                  <td>{(stock.port_allocation * 100).toFixed(2)}%</td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const data = useMemo(() => {
    return myData;
  }, []);

  return (
    <div>
      <ForceGraph2D
        graphData={data}
        nodeAutoColorBy="id"
        ref={forceRef}
        backgroundColor="#cfd9df"
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          const size = node.market_cap
            ? (node.market_cap / 10000000000) * 4.5
            : 50; // Size based on market cap, default size is 5
          ctx.fillStyle = node.color || "rgba(0,0,0,0.75)"; // Default color if none provided
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "white"; // Text color
          ctx.fillText(label, node.x, node.y);
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          const size = node.market_cap
            ? (node.market_cap / 10000000000) * 2.5
            : 50; // Size based on market cap, default size is 5
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, Math.PI * 2);
          ctx.fill();
        }}
      />
      {selectedNode != null && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            right: "20px",
            padding: "10px",
            background: "white",
            border: "1px solid black",
            borderRadius: "5px",
            maxWidth: "450px",
            overflowY: "scroll",
            maxHeight: "450px",
          }}>
          {selectedNode.group === "holding"
            ? createCompanyProfile(selectedNode)
            : createPortfolioProfile(selectedNode, user)}
        </div>
      )}
    </div>
  );
};

export default Home;
