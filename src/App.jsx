// src/CalculatorApp.jsx
import React, { useState } from "react";

export default function CalculatorApp() {
  const [display, setDisplay] = useState("0");
  const [formula, setFormula] = useState("");
  const [lastInputType, setLastInputType] = useState(null);

  const formatResult = (n) => {
    if (!isFinite(n)) return "Error";
    const rounded = Math.round((n + Number.EPSILON) * 1e10) / 1e10;
    let s = String(rounded);
    if (s.indexOf(".") !== -1) {
      s = s.replace(/(?:\.0+|(?<=[0-9])0+)$/g, (m) =>
        m.replace(/0+$/, "").replace(/\.$/, "")
      );
    }
    return s;
  };

  const handleClear = () => {
    setDisplay("0");
    setFormula("");
    setLastInputType(null);
  };

  const handleNum = (num) => {
    if (lastInputType === "equals") {
      setFormula(num === "0" ? "" : num);
      setDisplay(num);
      setLastInputType("num");
      return;
    }
    if (display === "0" && num === "0") return;
    if (
      (display === "0" && lastInputType !== "decimal") ||
      lastInputType === "op"
    ) {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
    setFormula((f) => f + num);
    setLastInputType("num");
  };

  const handleDecimal = () => {
    if (lastInputType === "equals") {
      setDisplay("0.");
      setFormula("0.");
      setLastInputType("decimal");
      return;
    }
    if (display.includes(".")) return;
    if (lastInputType === "op" || lastInputType === null) {
      setDisplay("0.");
      setFormula((f) => f + "0.");
    } else {
      setDisplay(display + ".");
      setFormula((f) => f + ".");
    }
    setLastInputType("decimal");
  };

  const handleOp = (op) => {
    if (lastInputType === "equals") {
      setFormula((f) => f + op);
      setLastInputType("op");
      return;
    }
    if (formula === "" && op === "-") {
      setFormula("-");
      setDisplay("-");
      setLastInputType("op");
      return;
    }
    if (lastInputType === "op") {
      if (op === "-") {
        setFormula((f) => f + "-");
        setDisplay(op);
        setLastInputType("op");
        return;
      }
      setFormula((f) => f.replace(/[+\-*/]+$/g, "") + op);
      setDisplay(op);
      setLastInputType("op");
      return;
    }
    setFormula((f) => f + op);
    setDisplay(op);
    setLastInputType("op");
  };

  const handleEquals = () => {
    if (!formula) return;
    let exp = formula.replace(/[+\-*/]+$/g, "");
    if (exp === "") return;
    if (!/^[0-9.+\-*/()]+$/.test(exp)) {
      setDisplay("Error");
      setFormula("");
      setLastInputType("equals");
      return;
    }
    try {
      const result = Function(`"use strict"; return (${exp});`)();
      const out = formatResult(result);
      setDisplay(out);
      setFormula(String(out));
      setLastInputType("equals");
    } catch (e) {
      setDisplay("Error");
      setFormula("");
      setLastInputType("equals");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        id="calculator"
        style={{
          width: "360px",
          background: "#fff",
          padding: "16px",
          borderRadius: "12px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.1)",
        }}
      >
        <div
          id="display"
          style={{
            background: "#000",
            color: "#fff",
            textAlign: "right",
            fontSize: "28px",
            padding: "12px",
            borderRadius: "8px",
          }}
        >
          {display}
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "8px",
            marginTop: "12px",
          }}
        >
          <button id="clear" onClick={handleClear}>
            AC
          </button>
          <button id="divide" onClick={() => handleOp("/")}>
            /
          </button>
          <button id="multiply" onClick={() => handleOp("*")}>
            *
          </button>
          <button id="subtract" onClick={() => handleOp("-")}>
            -
          </button>

          <button id="seven" onClick={() => handleNum("7")}>
            7
          </button>
          <button id="eight" onClick={() => handleNum("8")}>
            8
          </button>
          <button id="nine" onClick={() => handleNum("9")}>
            9
          </button>
          <button id="add" onClick={() => handleOp("+")}>
            +
          </button>

          <button id="four" onClick={() => handleNum("4")}>
            4
          </button>
          <button id="five" onClick={() => handleNum("5")}>
            5
          </button>
          <button id="six" onClick={() => handleNum("6")}>
            6
          </button>
          <div></div>

          <button id="one" onClick={() => handleNum("1")}>
            1
          </button>
          <button id="two" onClick={() => handleNum("2")}>
            2
          </button>
          <button id="three" onClick={() => handleNum("3")}>
            3
          </button>
          <button
            id="equals"
            style={{ gridRow: "span 2" }}
            onClick={handleEquals}
          >
            =
          </button>

          <button
            id="zero"
            style={{ gridColumn: "span 2" }}
            onClick={() => handleNum("0")}
          >
            0
          </button>
          <button id="decimal" onClick={handleDecimal}>
            .
          </button>
        </div>

        <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
          Incluye los IDs requeridos por los tests de FreeCodeCamp.
        </div>
      </div>
    </div>
  );
}
