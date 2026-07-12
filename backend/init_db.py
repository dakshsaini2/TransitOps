"""
Run this once to create all database tables:
    python -m app.init_db

For a clean reset (drop + recreate):
    python -m app.init_db --reset
"""
import asyncio
import sys
from loguru import logger
from app.database import engine, Base

# Must import all models so Base.metadata knows about them
import app.models  # noqa: F401


async def init_db(reset: bool = False):
    async with engine.begin() as conn:
        if reset:
            logger.warning("Dropping all tables...")
            await conn.run_sync(Base.metadata.drop_all)
            logger.info("All tables dropped.")

        logger.info("Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
        logger.success("Database tables created successfully.")


async def main():
    reset = "--reset" in sys.argv
    if reset:
        confirm = input("This will DELETE all data. Type 'yes' to confirm: ")
        if confirm.strip().lower() != "yes":
            print("Aborted.")
            return
    await init_db(reset=reset)


if __name__ == "__main__":
    asyncio.run(main())
