from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Date,
    DateTime,
    ForeignKey,
    Text,
)
from sqlalchemy.sql import func
from database import Base


class Solicitud(Base):
    __tablename__ = "Solicitudes_ATI"

    ID_Solicitud = Column(Integer, primary_key=True, index=True)
    Fecha_Creacion = Column(DateTime(timezone=True), server_default=func.now())
    Estatus = Column(String(50), default="Pendiente")

    # Datos Generales
    Fecha = Column(Date)
    Nombre_Solicitante = Column(String(150), nullable=False)

    # Datos del Usuario
    Numero_Empleado = Column(String(50))
    Puesto = Column(String(100))
    JobTask = Column(String(100))
    Usuario_Nombre = Column(String(150), nullable=False)
    Ubicacion = Column(String(100))
    Area = Column(String(100))
    Jefe_Inmediato = Column(String(150))

    # Equipo de trabajo
    Req_Computadora = Column(Boolean, default=False)
    Telefono_Reasignacion = Column(String(50))
    Req_Smartphone = Column(Boolean, default=False)
    TAG_Reasignacion = Column(String(50))
    Observaciones = Column(Text)

    # Software y Accesos Adicionales
    Soft_OneStream = Column(Boolean, default=False)
    Soft_Navision = Column(Boolean, default=False)
    Soft_GrupoTeams = Column(Boolean, default=False)
    Soft_Siscom = Column(Boolean, default=False)
    Soft_SITE = Column(Boolean, default=False)
    Soft_FlujoFacturacion = Column(Boolean, default=False)
    Soft_CRM = Column(Boolean, default=False)
    Soft_AcrobatPro = Column(Boolean, default=False)

    # Licencias con costo adicional
    Lic_CreativeCloud = Column(Boolean, default=False)
    Lic_Visio = Column(Boolean, default=False)
    Lic_Project = Column(Boolean, default=False)
    Lic_Teams = Column(Boolean, default=False)
    Lic_Otros = Column(String(255))


class DetalleNavision(Base):
    __tablename__ = "Detalles_Navision"

    ID_Navision = Column(Integer, primary_key=True, index=True)
    ID_Solicitud_Principal = Column(Integer, ForeignKey("Solicitudes_ATI.ID_Solicitud"))

    # Tipo de Solicitud (Alta, Reactivación, Modificación)
    Tipo_Solicitud = Column(String(50))

    # Listados (Almacenados como cadenas separadas por comas)
    Acceso_Companias = Column(Text)
    Area = Column(String(100))
    Puestos = Column(Text)
    Great = Column(Text)
    Unidad_Negocio = Column(Text)


class DirectorioEmpleado(Base):
    __tablename__ = "Directorio_Empleados"

    Email_Empleado = Column(String(150), primary_key=True, index=True)
    Nombre_Empleado = Column(String(150), nullable=False)
    Email_Jefe = Column(String(150), nullable=False)
    Nombre_Jefe = Column(String(150), nullable=False)
