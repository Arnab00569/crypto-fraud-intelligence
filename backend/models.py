from pydantic import BaseModel


class WalletAnalysisRequest(BaseModel):
    wallet_address: str
    blockchain: str = "ethereum"
    max_transactions: int = 50