import React, { useRef, useEffect, useState, useMemo } from "react";
import { ForceGraph2D } from "react-force-graph";
import { useAuth } from "../components/AuthProvider.js";
import supabase from "../services/supabase";

const Home = () => {
  const forceRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [search, setSearch] = useState(null);
  const [data, setData] = useState({ nodes: [], links: [] });
  const [divVisible, setDivVisible] = useState("none");
  const { user } = useAuth();

  useEffect(() => {
    (async () => {
      const { data: nodes, error: nodeError } = await supabase
        .from("nodes")
        .select();
      const { data: links, error: linkError } = await supabase
        .from("links")
        .select();

      if (nodeError) {
        console.error("Node Error:", nodeError);
      }
      if (linkError) {
        console.error("Link Error:", linkError);
      }
      console.log(nodes);
      console.log(links);

      setData({ nodes, links });
      const x_cor = 0;
      const y_cor = 0;
      if (user) {
        const { data, error } = await supabase
          .from("investments")
          .select()
          .eq("user_uid", user.id);
        console.log(data);
      }
      forceRef.current.zoom(0.05);
      forceRef.current.centerAt(x_cor, y_cor);
      forceRef.current.d3Force("charge").strength(-40000);
      forceRef.current.d3Force("link").distance(2000);
    })();
  }, []);

  const handleNodeClick = (node) => {
    if (forceRef.current) {
      forceRef.current.centerAt(node.x, node.y, 500);
      forceRef.current.zoom(0.25, 500);
      setSelectedNode(node);
      setDivVisible("block");
    }
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
  };

  const handleSearchClick = () => {
    const nodes = graphData.nodes;
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      if (node.id === search) {
        handleNodeClick(node);
      }
    }
  };

  const createCompanyProfile = (node) => {
    const companyInfo = JSON.parse(node.info)[0];
    return (
      <div className="pt-3 pb-3 pl-2 pr-2">
        <div className="flex flex-row gap-3 mb-3 w-full">
          <img src={companyInfo.image} alt={node.id} width="40" height="40" />
          <p style={{ fontSize: "24px" }}>{companyInfo.Company}</p>
          <button className="ml-40" onClick={() => setDivVisible("none")}>
            x
          </button>
        </div>
        <div className="flex flex-row gap-2 text-sm mb-3">
          {[companyInfo.sector, companyInfo.exchangeShortName].map((item) => {
            return (
              <div
                key={item}
                className="border border-black rounded-md border-2 p-1">
                {item}
              </div>
            );
          })}
        </div>
        <div className="grid grid-cols-10 gap-4">
          <div className="col-span-6 bg-blue-200 p-4">
            {companyInfo.description}
          </div>
          <div className="col-span-4 bg-red-200 p-4">
            {[
              node.investors,
              node.market_cap,
              companyInfo.beta,
              companyInfo.volAvg,
            ].map((item, index) => {
              let names = ["Investors", "Market Cap", "Beta", "Avg Vol"];
              return (
                <div
                  key={index}
                  className="flex flex-col items-center border border-black mb-3 rounded-md border-2 p-1">
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
    if (!node) return;
    const portfolio = JSON.parse(node.portfolio);
    return (
      <div className="pt-3 pb-3 pl-2 pr-2">
        <div className="flex flex-row gap-3 mb-3 w-full">
          <div style={{ fontSize: "24px" }} className="mb-2">
            {node.id}
          </div>
          <button className="ml-60" onClick={() => setDivVisible("none")}>
            x
          </button>
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

  const graphData = useMemo(() => {
    return data;
  }, [data.nodes]);

  return (
    <div>
      <div className="flex flex-row">
        <input
          type="text"
          className="border border-black rounded-md border-2"
          onChange={handleSearchChange}
        />
        <button onClick={handleSearchClick}>search</button>
      </div>

      <ForceGraph2D
        graphData={graphData}
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
          display: divVisible,
        }}>
        {selectedNode && selectedNode.group === "holding"
          ? createCompanyProfile(selectedNode)
          : createPortfolioProfile(selectedNode, user)}
      </div>
    </div>
  );
};

export default Home;
