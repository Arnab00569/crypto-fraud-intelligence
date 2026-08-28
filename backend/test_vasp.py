from blockchain.vasp import load_vasp_addresses


vasps = load_vasp_addresses()


print("\n==============================")
print("VASP INTELLIGENCE DATABASE")
print("==============================")


print(
    "Known addresses:",
    len(vasps)
)


for address, information in vasps.items():

    print("\nAddress:")
    print(address)

    print(
        "VASP:",
        information["vasp"]
    )

    print(
        "Chain:",
        information["chain"]
    )

    print(
        "Type:",
        information["address_type"]
    )

    print(
        "Confidence:",
        information["confidence"]
    )