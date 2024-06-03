import React, { useRef, useEffect, useState, useMemo } from "react";
import { ForceGraph2D } from "react-force-graph";
import { useAuth } from "../components/AuthProvider.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import supabase from "../services/supabase";
import {
  faMagnifyingGlass,
  faLocationArrow,
  faEarthAmericas,
} from "@fortawesome/free-solid-svg-icons";
import "font-awesome/css/font-awesome.min.css";

const Home = () => {
  const forceRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState(null);
  const [search, setSearch] = useState(null);
  const [data, setData] = useState({ nodes: [], links: [] });
  const [divVisible, setDivVisible] = useState("none");
  const [suggestions, setSuggestions] = useState([]);
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

      setData({ nodes, links });

      forceRef.current.d3Force("charge").strength(-90000);
      forceRef.current.d3Force("link").distance(4500);
      handleZoomOut();
    })();
  }, [user]);

  const handleNodeClick = (node) => {
    if (forceRef.current) {
      console.log(node);
      forceRef.current.centerAt(node.x, node.y, 500);
      forceRef.current.zoom(0.05, 500);
      setSelectedNode(node);
      setDivVisible("block");
    }
  };

  const handleZoomOut = () => {
    forceRef.current.centerAt(-20, 0, 500);
    forceRef.current.zoom(0.02, 500);
    setDivVisible("none");
    setSearch("");
  };

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearch(value);
    console.log(graphData.nodes);
    if (value.length > 0) {
      const filteredSuggestions = graphData.nodes.filter((item) =>
        item.id.toLowerCase().startsWith(value.toLowerCase())
      );
      console.log(filteredSuggestions);
      if (filteredSuggestions.length > 0) {
        setSuggestions(filteredSuggestions.map((node) => node.id));
      }
    } else {
      setSuggestions([]);
    }
  };

  const identifyNodeByID = (nodeId) => {
    const nodes = graphData.nodes;
    for (let i = 0; i < nodes.length; i++) {
      let node = nodes[i];
      if (node.id === nodeId) {
        return node;
      }
    }
  };

  const handleSearchClick = () => {
    const node = identifyNodeByID(search);
    console.log(node);
    if (node) {
      handleNodeClick(node);
    }
  };

  const handleMyPortfolio = () => {
    const node = identifyNodeByID(user.id);
    console.log(node);
    node ? handleNodeClick(node) : handleZoomOut();
  };

  const createCompanyProfile = (node) => {
    const companyInfo = JSON.parse(node.info)[0];
    return (
      <div className="pt-3 pb-3 pl-2 pr-2">
        <div className="flex flex-row gap-3 mb-3 w-full">
          <img src={companyInfo.image} alt={node.id} width="80" height="40" />
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
              {/* {user ? (
                <>
                  <th>Shares</th>
                  <th>Value</th>
                </>
              ) : (
                <th>Allocation</th>
              )} */}
              <th>Allocation</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((stock, index) => (
              <tr key={index}>
                <td>{stock.Company}</td>
                <td>{stock.Symbol}</td>
                <td>{(stock.port_allocation * 100).toFixed(2)}%</td>
                {/* {user ? (
                  <>
                    <td>{stock.shares.toFixed(4)}</td>
                    <td>${stock.value.toFixed(2)}</td>
                  </>
                ) : (
                  <td>{(stock.port_allocation * 100).toFixed(2)}%</td>
                )} */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const graphData = useMemo(() => {
    return data;
  }, [data]);

  return (
    <div>
      <div
        style={{
          zIndex: 2,
          top: 16,
          left: 90,
        }}
        className="fixed left-40 flex flex-row items-center">
        <input
          type="text"
          onChange={handleSearchChange}
          value={search}
          placeholder="Search..."
          style={{
            height: "28px",
            width: "200px",
            padding: "0 10px",
            border: "1px solid #D1D1D1",
            borderRadius: "4px 0 0 4px",
            outline: "none",
            fontSize: "14px",
          }}
        />
        {suggestions.length > 0 && (
          <ul
            style={{
              position: "absolute",
              top: "30px",
              left: "0",
              width: "100%",
              border: "1px solid #D1D1D1",
              backgroundColor: "white",
              listStyle: "none",
              padding: "0",
              margin: "0",
              borderRadius: "0 0 4px 4px",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
              zIndex: 1,
            }}>
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                style={{
                  padding: "8px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setSearch(suggestion);
                  handleSearchClick();
                  setSuggestions([]);
                }}>
                {suggestion}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={handleSearchClick}
          style={{
            height: "28px",
            padding: "0 10px",
            backgroundColor: "#1D1D1F",
            border: "none",
            borderRadius: "0 4px 4px 0",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            style={{ color: "#FEFEFE" }}
          />
        </button>
        {user && (
          <button
            onClick={handleMyPortfolio}
            style={{
              height: "28px",
              marginLeft: "10px",
              padding: "0 10px",
              backgroundColor: "#1D1D1F",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: "14px",
            }}>
            <FontAwesomeIcon
              icon={faLocationArrow}
              style={{ color: "#FEFEFE" }}
            />
          </button>
        )}
        <button
          onClick={handleZoomOut}
          style={{
            height: "28px",
            marginLeft: "10px",
            padding: "0 10px",
            backgroundColor: "#1D1D1F",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: "14px",
          }}>
          <FontAwesomeIcon
            icon={faEarthAmericas}
            style={{ color: "#FEFEFE" }}
          />
        </button>
      </div>

      <ForceGraph2D
        graphData={graphData}
        nodeAutoColorBy="id"
        ref={forceRef}
        backgroundColor="#FEFEFE"
        onNodeClick={handleNodeClick}
        nodeCanvasObject={(node, ctx, globalScale) => {
          const label = node.id;
          const fontSize = 12 / globalScale;
          const size = node.market_cap
            ? (node.market_cap / 10000000000) * 12
            : 400; // Size based on market cap, default size is 5

          // Add shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          // Draw node with shadow
          ctx.fillStyle = node.color || "rgba(60, 60, 60, 0.9)";
          ctx.beginPath();
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI, false);
          ctx.fill();

          // Remove shadow for text and border
          ctx.shadowColor = "transparent";

          // Draw node border
          ctx.lineWidth = 1 / globalScale;
          ctx.strokeStyle = "#FFF";
          ctx.stroke();

          // Draw text
          ctx.font = `${fontSize}px 'Helvetica Neue', Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "#FFF"; // Text color
          ctx.fillText(label, node.x, node.y);
        }}
        nodePointerAreaPaint={(node, color, ctx) => {
          ctx.fillStyle = color;
          const size = node.market_cap
            ? (node.market_cap / 10000000000) * 2.5
            : 250; // Size based on market cap, default size is 5
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
