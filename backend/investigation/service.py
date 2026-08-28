from blockchain.transactions import (
    get_eth_transactions
)

from blockchain.graph import (
    create_transaction_graph
)

from blockchain.risk import (
    calculate_risk_score
)

from blockchain.vasp import (
    load_vasp_addresses,
    find_nearest_vasp
)

from blockchain.patterns import (
    detect_fan_patterns,
    detect_rapid_movements,
    detect_layering
)


def analyze_wallet(
    wallet_address: str,
    max_transactions: int = 50
):

    # ============================================
    # 1. FETCH BLOCKCHAIN TRANSACTIONS
    # ============================================

    transactions = get_eth_transactions(
        wallet_address,
        max_count=max_transactions
    )

    # ============================================
    # 2. BUILD TRANSACTION GRAPH
    # ============================================

    graph = create_transaction_graph(
        transactions
    )

    # ============================================
    # 3. RISK ANALYSIS
    # ============================================

    risk = calculate_risk_score(
        graph,
        wallet_address,
        transactions
    )

    # ============================================
    # 4. PATTERN ANALYSIS
    # ============================================

    fan_patterns = detect_fan_patterns(
        graph
    )

    rapid_movements = detect_rapid_movements(
        transactions,
        wallet_address
    )

    layering = detect_layering(
        graph,
        wallet_address
    )

    # ============================================
    # 5. VASP ANALYSIS
    # ============================================

    vasp_database = load_vasp_addresses()

    vasp_results = find_nearest_vasp(
        graph,
        wallet_address,
        vasp_database
    )

    # ============================================
    # 6. RETURN UNIFIED INTELLIGENCE
    # ============================================

    return {

        "wallet": wallet_address,

        "blockchain": "ethereum",

        "summary": {

            "transactions_analyzed":
                len(transactions),

            "wallets_in_graph":
                graph.number_of_nodes(),

            "transaction_links":
                graph.number_of_edges()
        },

        "risk": risk,

        "patterns": {

            "fan_patterns":
                fan_patterns,

            "rapid_movements":
                rapid_movements,

            "layering":
                layering
        },

        "vasp_exposure": vasp_results,

        "transactions": transactions
    }