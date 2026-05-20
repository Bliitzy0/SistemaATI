from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# El formato es: mssql+pyodbc://usuario:password@servidor/base_de_datos?driver=ODBC+Driver+17+for+SQL+Server
# Para localhost con Windows Authentication (Trusted_Connection):
DATABASE_URL = "mssql+pyodbc://localhost/SistemaATI?driver=ODBC+Driver+17+for+SQL+Server&trusted_connection=yes"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# Dependencia para obtener la sesión de BD en los endpoints
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
