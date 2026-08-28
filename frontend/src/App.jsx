import { useState } from "react";
import "./App.css";
import TransactionGraph from "./TransactionGraph";

function App() {
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [simpleMode, setSimpleMode] = useState(true);

  async function analyzeWallet() {
    if (!wallet.trim()) {
      setError("Please enter a cryptocurrency wallet address.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/analyze",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: wallet.trim(),
            blockchain: "ethereum",
            max_transactions: 50,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Unable to analyze the wallet."
        );
      }

      setResult(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function getRiskClass(level) {
    if (level === "HIGH") return "risk-high";
    if (level === "MEDIUM") return "risk-medium";
    return "risk-low";
  }

  function getRiskExplanation(level) {
    if (level === "HIGH") {
      return "This wallet shows several behaviors that deserve immediate investigation.";
    }

    if (level === "MEDIUM") {
      return "This wallet shows some unusual activity that may require further investigation.";
    }

    return "No strong evidence of suspicious behavior was found, although some unusual activity may still be present.";
  }

  function getIndicatorExplanation(indicator) {
    const explanations = {
      "Elevated transaction activity":
        "This wallet has been involved in a relatively large number of transfers.",

      "High transaction activity":
        "This wallet has been involved in many transfers.",

      "High incoming transaction activity":
        "Money is arriving at this wallet from multiple transactions.",

      "High outgoing transaction activity":
        "Money is being sent from this wallet through many transactions.",

      "High fan-in activity":
        "Many different wallets are sending money into this wallet.",

      "High fan-out activity":
        "This wallet is sending money to many different wallets.",

      "High two-way transaction activity":
        "Money is moving both into and out of this wallet.",

      "Large number of counterparties":
        "The wallet interacts with many different wallets.",

      "High counterparty diversity":
        "The wallet has connections with many different addresses.",

      "Large-value transaction detected":
        "At least one transaction involved a comparatively large amount of cryptocurrency.",

      "Fan-in pattern detected":
        "Many wallets are sending funds into this wallet.",

      "Fan-out pattern detected":
        "This wallet is distributing funds to several other wallets.",
    };

    return (
      explanations[indicator] ||
      "The system detected an unusual transaction behavior."
    );
  }

  return (
    <div className="app">

      {/* HEADER */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-icon">
            ◈
          </div>

          <div>
            <h1>CryptoGuard</h1>
            <p>Blockchain Fraud Intelligence</p>
          </div>

        </div>

        <div className="system-status">
          <span className="status-dot"></span>
          System Online
        </div>

      </header>


      <main className="container">

        {/* SEARCH */}

        <section className="hero">

          <div className="hero-text">

            <span className="eyebrow">
              BLOCKCHAIN INVESTIGATION
            </span>

            <h2>
              Investigate a cryptocurrency wallet
            </h2>

            <p>
              Enter a wallet address to analyze its
              transaction activity, money movement,
              connected wallets and suspicious behavior.
            </p>

          </div>


          <div className="search-box">

            <label>
              Wallet address
            </label>

            <div className="search-row">

              <input
                value={wallet}
                onChange={(e) =>
                  setWallet(e.target.value)
                }
                placeholder="0x..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    analyzeWallet();
                  }
                }}
              />

              <button
                onClick={analyzeWallet}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Analyze"}
              </button>

            </div>

            <div className="search-help">
              Currently supported blockchain: Ethereum
            </div>

          </div>

        </section>


        {error && (
          <div className="error-box">
            <strong>Analysis failed</strong>
            <span>{error}</span>
          </div>
        )}


        {result && (

          <div className="investigation">

            {/* INVESTIGATION HEADER */}

            <section className="investigation-header">

              <div>

                <span className="eyebrow">
                  INVESTIGATION RESULT
                </span>

                <h2>
                  Wallet behavior assessment
                </h2>

              </div>


              <div className="view-toggle">

                <button
                  className={
                    simpleMode ? "active" : ""
                  }
                  onClick={() => setSimpleMode(true)}
                >
                  Simple View
                </button>

                <button
                  className={
                    !simpleMode ? "active" : ""
                  }
                  onClick={() => setSimpleMode(false)}
                >
                  Technical View
                </button>

              </div>

            </section>


            {/* RISK */}

            <section className="risk-section">

              <div
                className={`risk-card ${getRiskClass(
                  result.risk.risk_level
                )}`}
              >

                <div className="risk-label">
                  INVESTIGATION PRIORITY
                </div>

                <div className="risk-score">
                  {result.risk.risk_score}
                </div>

                <div className="risk-level">
                  {result.risk.risk_level}
                </div>

                <p>
                  {getRiskExplanation(
                    result.risk.risk_level
                  )}
                </p>

              </div>


              <div className="wallet-card">

                <span>Wallet under investigation</span>

                <code>
                  {result.wallet}
                </code>

                <div className="wallet-meta">

                  <span>
                    {result.blockchain.toUpperCase()}
                  </span>

                  <span>
                    {result.summary.transactions_analyzed}
                    {" "}
                    transactions analyzed
                  </span>

                </div>

              </div>

            </section>


            {/* SUMMARY CARDS */}

            <section className="summary-grid">

              <div className="summary-card">

                <span className="summary-icon">
                  ↓
                </span>

                <div>
                  <span>Money received</span>

                  <strong>
                    {result.risk.incoming_connections}
                  </strong>

                  <small>
                    incoming transfers
                  </small>
                </div>

              </div>


              <div className="summary-card">

                <span className="summary-icon">
                  ↑
                </span>

                <div>
                  <span>Money sent</span>

                  <strong>
                    {result.risk.outgoing_connections}
                  </strong>

                  <small>
                    outgoing transfers
                  </small>
                </div>

              </div>


              <div className="summary-card">

                <span className="summary-icon">
                  ◉
                </span>

                <div>
                  <span>Connected wallets</span>

                  <strong>
                    {result.risk.counterparty_count}
                  </strong>

                  <small>
                    other addresses
                  </small>
                </div>

              </div>


              <div className="summary-card">

                <span className="summary-icon">
                  ⚡
                </span>

                <div>
                  <span>Rapid movements</span>

                  <strong>
                    {result.patterns.rapid_movements.length}
                  </strong>

                  <small>
                    detected events
                  </small>

                </div>

              </div>

            </section>


            {/* WHAT DID WE FIND */}

            <section className="panel findings-panel">

              <div className="panel-header">

                <div>
                  <span className="eyebrow">
                    AUTOMATED ASSESSMENT
                  </span>

                  <h3>
                    What did we find?
                  </h3>
                </div>

              </div>


              <div className="finding-list">

                {result.risk.indicators.length === 0 ? (

                  <div className="clean-finding">
                    <span>✓</span>

                    <div>
                      <strong>
                        No major warning signs detected
                      </strong>

                      <p>
                        The current analysis did not
                        identify significant unusual
                        transaction behavior.
                      </p>
                    </div>
                  </div>

                ) : (

                  result.risk.indicators.map(
                    (indicator, index) => (

                      <div
                        className="finding"
                        key={index}
                      >

                        <span className="finding-icon">
                          ⚠
                        </span>

                        <div>

                          <strong>
                            {simpleMode
                              ? indicator.replace(
                                  " detected",
                                  ""
                                )
                              : indicator}
                          </strong>

                          <p>
                            {simpleMode
                              ? getIndicatorExplanation(
                                  indicator
                                )
                              : getIndicatorExplanation(
                                  indicator
                                )}
                          </p>

                        </div>

                      </div>

                    )
                  )

                )}

              </div>

            </section>


            {/* MONEY FLOW */}

            <section className="panel">

  <div className="panel-header">

    <div>
      <span className="eyebrow">
        TRANSACTION NETWORK
      </span>

      <h3>
        How is money moving?
      </h3>

      <p
        style={{
          color: "#7f8da3",
          fontSize: "12px",
          marginTop: "6px",
        }}
      >
        This map shows wallets connected through
        the transactions found during the investigation.
      </p>
    </div>

  </div>

  <TransactionGraph
  transactions={result.transactions}
  investigatedWallet={result.wallet}
  rapidMovements={
    result.patterns.rapid_movements
  }
/>

</section>


            {/* BEHAVIOR */}

            <section className="panel">

              <div className="panel-header">

                <div>
                  <span className="eyebrow">
                    BEHAVIOR
                  </span>

                  <h3>
                    Detected activity patterns
                  </h3>
                </div>

              </div>


              <div className="behavior-grid">

                {result.patterns.fan_patterns.map(
                  (pattern, index) => (

                    <div
                      className="behavior-card"
                      key={`fan-${index}`}
                    >

                      <span className="behavior-icon">
                        ⇄
                      </span>

                      <strong>
                        {simpleMode
                          ? pattern.pattern === "FAN_IN"
                            ? "Many wallets sent money here"
                            : "Money was sent to many wallets"
                          : pattern.pattern}
                      </strong>

                      <p>
                        {pattern.description}
                      </p>

                      <div className="behavior-stats">
                        <span>
                          Received: {pattern.incoming}
                        </span>

                        <span>
                          Sent: {pattern.outgoing}
                        </span>
                      </div>

                    </div>

                  )
                )}


                {result.patterns.rapid_movements.map(
                  (pattern, index) => (

                    <div
                      className="behavior-card rapid"
                      key={`rapid-${index}`}
                    >

                      <span className="behavior-icon">
                        ⚡
                      </span>

                      <strong>
                        Money moved quickly
                      </strong>

                      <p>
                        Funds were received and
                        another transfer followed
                        shortly afterward.
                      </p>

                      <div className="behavior-stats">

                        <span>
                          Delay:
                          {" "}
                          {pattern.delay_seconds}
                          {" "}
                          seconds
                        </span>

                      </div>

                    </div>

                  )
                )}

              </div>

            </section>


            {/* VASP */}

            <section className="panel">

              <div className="panel-header">

                <div>

                  <span className="eyebrow">
                    SERVICE PROVIDER CHECK
                  </span>

                  <h3>
                    Did the money reach a known exchange?
                  </h3>

                </div>

              </div>


              {result.vasp_exposure.length === 0 ? (

                <div className="vasp-empty">

                  <div className="vasp-icon">
                    ?
                  </div>

                  <div>

                    <strong>
                      No known exchange identified
                    </strong>

                    <p>
                      The current database does not
                      contain a confirmed exchange or
                      virtual-asset service provider
                      connected to this wallet.
                    </p>

                  </div>

                </div>

              ) : (

                <div className="vasp-results">

                  {result.vasp_exposure.map(
                    (vasp, index) => (

                      <div
                        className="vasp-result"
                        key={index}
                      >

                        <strong>
                          {vasp.vasp}
                        </strong>

                        <span>
                          {vasp.distance} transfers away
                        </span>

                        <span>
                          Confidence: {vasp.confidence}
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>


            {/* TECHNICAL DETAILS */}

            {!simpleMode && (

              <section className="panel technical-panel">

                <div className="panel-header">

                  <div>
                    <span className="eyebrow">
                      TECHNICAL EVIDENCE
                    </span>

                    <h3>
                      Analyst details
                    </h3>
                  </div>

                </div>


                <div className="technical-grid">

                  <div>
                    <span>
                      Graph nodes
                    </span>

                    <strong>
                      {result.summary.wallets_in_graph}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Transaction links
                    </span>

                    <strong>
                      {result.summary.transaction_links}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Maximum transaction
                    </span>

                    <strong>
                      {result.risk.maximum_transaction_value}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Fan patterns
                    </span>

                    <strong>
                      {result.patterns.fan_patterns.length}
                    </strong>
                  </div>

                </div>

              </section>

            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default App;