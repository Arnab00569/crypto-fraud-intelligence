import { useState } from "react";

import "./App.css";


function App() {

  const [wallet, setWallet] = useState("");

  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");


  async function analyzeWallet() {

    if (!wallet.trim()) {

      setError(
        "Please enter a wallet address."
      );

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
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            wallet_address:
              wallet.trim(),

            blockchain:
              "ethereum",

            max_transactions:
              50
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Analysis failed."
        );
      }


      setResult(
        data.analysis
      );

    } catch (err) {

      setError(
        err.message
      );

    } finally {

      setLoading(false);
    }
  }


  return (

    <div className="app">

      <header className="header">

        <div>

          <h1>
            Crypto Fraud Intelligence
          </h1>

          <p>
            Automated Blockchain Investigation Platform
          </p>

        </div>

        <div className="status">
          ● SYSTEM ONLINE
        </div>

      </header>


      <main>

        <section className="search-panel">

          <label>
            Suspect Wallet Address
          </label>

          <div className="search-row">

            <input
              value={wallet}
              onChange={
                (e) =>
                  setWallet(e.target.value)
              }
              placeholder="0x..."
            />

            <button
              onClick={analyzeWallet}
              disabled={loading}
            >

              {loading
                ? "ANALYZING..."
                : "ANALYZE"}

            </button>

          </div>


          {error && (

            <div className="error">
              {error}
            </div>

          )}

        </section>


        {result && (

          <>

            <section className="cards">

              <div className="card">

                <span>
                  RISK SCORE
                </span>

                <strong>
                  {result.risk.risk_score}
                </strong>

                <small>
                  {result.risk.risk_level}
                </small>

              </div>


              <div className="card">

                <span>
                  TRANSACTIONS
                </span>

                <strong>
                  {
                    result.summary
                      .transactions_analyzed
                  }
                </strong>

                <small>
                  analyzed
                </small>

              </div>


              <div className="card">

                <span>
                  COUNTERPARTIES
                </span>

                <strong>
                  {
                    result.risk
                      .counterparty_count
                  }
                </strong>

                <small>
                  wallets
                </small>

              </div>


              <div className="card">

                <span>
                  VASP EXPOSURE
                </span>

                <strong>
                  {
                    result.vasp_exposure.length
                  }
                </strong>

                <small>
                  detected
                </small>

              </div>

            </section>


            <section className="content-grid">

              <div className="panel">

                <h2>
                  Investigation Summary
                </h2>

                <div className="wallet-display">

                  <span>
                    Wallet
                  </span>

                  <code>
                    {result.wallet}
                  </code>

                </div>


                <div className="metrics">

                  <div>
                    <span>
                      Incoming
                    </span>

                    <strong>
                      {
                        result.risk
                          .incoming_connections
                      }
                    </strong>
                  </div>


                  <div>
                    <span>
                      Outgoing
                    </span>

                    <strong>
                      {
                        result.risk
                          .outgoing_connections
                      }
                    </strong>
                  </div>


                  <div>
                    <span>
                      Graph Nodes
                    </span>

                    <strong>
                      {
                        result.summary
                          .wallets_in_graph
                      }
                    </strong>
                  </div>


                  <div>
                    <span>
                      Graph Links
                    </span>

                    <strong>
                      {
                        result.summary
                          .transaction_links
                      }
                    </strong>
                  </div>

                </div>

              </div>


              <div className="panel">

                <h2>
                  Risk Indicators
                </h2>

                {result.risk.indicators
                  .length === 0 ? (

                    <p className="clean">
                      No significant risk
                      indicators detected.
                    </p>

                  ) : (

                    <ul>

                      {result.risk.indicators.map(
                        (indicator, index) => (

                          <li key={index}>
                            ⚠ {indicator}
                          </li>

                        )
                      )}

                    </ul>

                  )}

              </div>

            </section>


            <section className="panel">

              <h2>
                Detected Behavioral Patterns
              </h2>

              <div className="patterns">

                {result.patterns.fan_patterns
                  .map(
                    (pattern, index) => (

                      <div
                        className="pattern"
                        key={`fan-${index}`}
                      >

                        <strong>
                          {pattern.pattern}
                        </strong>

                        <p>
                          {pattern.description}
                        </p>

                        <small>
                          Incoming:
                          {" "}
                          {pattern.incoming}
                          {" | "}
                          Outgoing:
                          {" "}
                          {pattern.outgoing}
                        </small>

                      </div>

                    )
                  )}


                {result.patterns.rapid_movements
                  .map(
                    (pattern, index) => (

                      <div
                        className="pattern"
                        key={`rapid-${index}`}
                      >

                        <strong>
                          RAPID MOVEMENT
                        </strong>

                        <p>
                          {pattern.description}
                        </p>

                        <small>
                          Delay:
                          {" "}
                          {pattern.delay_seconds}
                          {" "}
                          seconds
                        </small>

                      </div>

                    )
                  )}


                {result.patterns.layering
                  .map(
                    (pattern, index) => (

                      <div
                        className="pattern"
                        key={`layer-${index}`}
                      >

                        <strong>
                          MULTI-HOP LAYERING
                        </strong>

                        <p>
                          {pattern.description}
                        </p>

                        <small>
                          Hop distance:
                          {" "}
                          {pattern.hop_distance}
                        </small>

                      </div>

                    )
                  )}

              </div>

            </section>


            <section className="panel">

              <h2>
                VASP Exposure
              </h2>

              {result.vasp_exposure.length === 0 ? (

                <p className="clean">
                  No known VASP exposure detected
                  in the current attribution database.
                </p>

              ) : (

                <div>

                  {result.vasp_exposure.map(
                    (vasp, index) => (

                      <div
                        className="vasp-row"
                        key={index}
                      >

                        <strong>
                          {vasp.vasp}
                        </strong>

                        <span>
                          {vasp.distance} hops
                        </span>

                        <span>
                          {vasp.confidence}
                        </span>

                      </div>

                    )
                  )}

                </div>

              )}

            </section>

          </>

        )}

      </main>

    </div>

  );
}


export default App;