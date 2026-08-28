import csv
from pathlib import Path

import networkx as nx


DATA_FILE = (
    Path(__file__).parent.parent
    / "data"
    / "vasp_addresses.csv"
)


def load_vasp_addresses():

    vasp_addresses = {}

    if not DATA_FILE.exists():
        raise FileNotFoundError(
            f"VASP database not found: {DATA_FILE}"
        )

    with open(
        DATA_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        reader = csv.DictReader(file)

        for row in reader:

            address = row["address"].lower()

            vasp_addresses[address] = {
                "vasp": row["vasp"],
                "chain": row["chain"],
                "address_type": row["address_type"],
                "confidence": row["confidence"],
                "source": row["source"]
            }

    return vasp_addresses


def find_nearest_vasp(
    graph,
    suspect_wallet,
    vasp_addresses
):

    suspect = suspect_wallet.lower()

    results = []

    if suspect not in graph:
        return results

    for address, information in vasp_addresses.items():

        if address not in graph:
            continue

        try:

            distance = nx.shortest_path_length(
                graph,
                suspect,
                address
            )

            path = nx.shortest_path(
                graph,
                suspect,
                address
            )

            results.append({

                "vasp": information["vasp"],

                "address": address,

                "distance": distance,

                "path": path,

                "confidence": information["confidence"],

                "address_type": information["address_type"]

            })

        except nx.NetworkXNoPath:

            continue

    results.sort(
        key=lambda x: x["distance"]
    )

    return results