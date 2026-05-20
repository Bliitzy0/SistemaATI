from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import date
from typing import Optional, List
import models
from database import get_db
import os
from dotenv import load_dotenv
from fastapi_azure_auth import SingleTenantAzureAuthorizationCodeBearer

load_dotenv()

app = FastAPI()

# azure_scheme = SingleTenantAzureAuthorizationCodeBearer(
#     app_client_id=os.environ.get("AZURE_CLIENT_ID", "mock_client_id"),
#     tenant_id=os.environ.get("AZURE_TENANT_ID", "mock_tenant_id"),
#     scopes={
#         f'api://{os.environ.get("AZURE_CLIENT_ID", "")}/user_impersonation': 'user_impersonation',
#     }
# )

# @app.on_event('startup')
# async def load_config() -> None:
#     await azure_scheme.openid_config.load_config()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SolicitudCreate(BaseModel):
    fecha: date
    nombre_solicitante: str
    numero_empleado: Optional[str] = None
    puesto: Optional[str] = None
    job_task: Optional[str] = None
    usuario_nombre: str
    ubicacion: Optional[str] = None
    area: Optional[str] = None
    jefe_inmediato: Optional[str] = None

    req_computadora: bool = False
    telefono_reasignacion: Optional[str] = None
    req_smartphone: bool = False
    tag_reasignacion: Optional[str] = None
    observaciones: Optional[str] = None

    soft_onestream: bool = False
    soft_navision: bool = False
    soft_grupo_teams: bool = False
    soft_siscom: bool = False
    soft_site: bool = False
    soft_flujo_facturacion: bool = False
    soft_crm: bool = False
    soft_acrobat_pro: bool = False

    lic_creative_cloud: bool = False
    lic_visio: bool = False
    lic_project: bool = False
    lic_teams: bool = False
    lic_otros: Optional[str] = None


class NavisionCreate(BaseModel):
    id_solicitud_principal: int
    tipo_solicitud: str
    acceso_companias: List[str]
    area: str
    puestos: List[str]
    great: List[str]
    unidad_negocio: List[str]


# Función interna para enviar el correo usando el SMTP de Office 365
def enviar_correo_aprobacion(
    email_jefe: str, nombre_jefe: str, nombre_solicitante: str, id_solicitud: int
):
    smtp_server = "smtp.office365.com"
    port = 587
    sender_email = (
        "sistema_ati@tuempresa.com"  # Reemplazar con una cuenta válida de la empresa
    )
    sender_password = "tu_password_o_token_de_aplicacion"

    mensaje = MIMEMultipart("alternative")
    mensaje["Subject"] = f"Aprobación Requerida - Solicitud ATI #{id_solicitud}"
    mensaje["From"] = sender_email
    mensaje["To"] = email_jefe

    html_content = f"""
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 8px;">
            <h2 style="color: #0056b3; border-bottom: 2px solid #0056b3; padding-bottom: 10px;">Control de Accesos - Sistema ATI</h2>
            <p>Estimado(a) <strong>{nombre_jefe}</strong>,</p>
            <p>Se ha registrado una nueva solicitud de infraestructura tecnológica con el Folio <strong>#{id_solicitud}</strong>.</p>
            <p><strong>Solicitante:</strong> {nombre_solicitante}</p>
            <p>Por favor, valide los requerimientos haciendo clic en una de las siguientes opciones:</p>
            <br>
            <div style="text-align: center; margin: 20px 0;">
                <a href="http://localhost:8000/api/aprobaciones/{id_solicitud}?estado=Aprobado" 
                   style="background-color: #28a745; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-right: 15px; display: inline-block;">
                   Aprobar Solicitud
                </a>
                <a href="http://localhost:8000/api/aprobaciones/{id_solicitud}?estado=Rechazado" 
                   style="background-color: #dc3545; color: white; padding: 12px 25px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                   Rechazar
                </a>
            </div>
            <p style="font-size: 11px; color: #777; text-align: center; margin-top: 30px;">Este es un correo automatizado generado por el departamento de TI.</p>
        </div>
      </body>
    </html>
    """
    mensaje.attach(MIMEText(html_content, "html"))

    try:
        server = smtplib.SMTP(smtp_server, port)
        server.starttls()
        server.login(sender_email, sender_password)
        server.sendmail(sender_email, email_jefe, mensaje.as_string())
        server.quit()
        return True
    except Exception as e:
        print(f"Error al enviar correo: {str(e)}")
        return False


# @app.post("/api/solicitudes", dependencies=[Depends(azure_scheme)])
@app.post("/api/solicitudes")
def crear_solicitud(solicitud: SolicitudCreate, db: Session = Depends(get_db)):
    # 1. Buscar al empleado en nuestro directorio local por nombre
    empleado = (
        db.query(models.DirectorioEmpleado)
        .filter(
            models.DirectorioEmpleado.Nombre_Empleado == solicitud.nombre_solicitante
        )
        .first()
    )

    # 2. Mapear y guardar la solicitud principal
    nueva_solicitud = models.Solicitud(
        Fecha=solicitud.fecha,
        Nombre_Solicitante=solicitud.nombre_solicitante,
        Numero_Empleado=solicitud.numero_empleado,
        Puesto=solicitud.puesto,
        JobTask=solicitud.job_task,
        Usuario_Nombre=solicitud.usuario_nombre,
        Ubicacion=solicitud.ubicacion,
        Area=solicitud.area,
        Jefe_Inmediato=solicitud.jefe_inmediato,
        Req_Computadora=solicitud.req_computadora,
        Telefono_Reasignacion=solicitud.telefono_reasignacion,
        Req_Smartphone=solicitud.req_smartphone,
        TAG_Reasignacion=solicitud.tag_reasignacion,
        Observaciones=solicitud.observaciones,
        Soft_OneStream=solicitud.soft_onestream,
        Soft_Navision=solicitud.soft_navision,
        Soft_GrupoTeams=solicitud.soft_grupo_teams,
        Soft_Siscom=solicitud.soft_siscom,
        Soft_SITE=solicitud.soft_site,
        Soft_FlujoFacturacion=solicitud.soft_flujo_facturacion,
        Soft_CRM=solicitud.soft_crm,
        Soft_AcrobatPro=solicitud.soft_acrobat_pro,
        Lic_CreativeCloud=solicitud.lic_creative_cloud,
        Lic_Visio=solicitud.lic_visio,
        Lic_Project=solicitud.lic_project,
        Lic_Teams=solicitud.lic_teams,
        Lic_Otros=solicitud.lic_otros,
    )

    db.add(nueva_solicitud)
    db.commit()
    db.refresh(nueva_solicitud)

    # 3. Disparar el correo automático al jefe identificado (si se encontró el empleado)
    correo_enviado = False
    if empleado:
        correo_enviado = enviar_correo_aprobacion(
            email_jefe=empleado.Email_Jefe,
            nombre_jefe=empleado.Nombre_Jefe,
            nombre_solicitante=empleado.Nombre_Empleado,
            id_solicitud=nueva_solicitud.ID_Solicitud,
        )

    return {
        "mensaje": "Solicitud creada exitosamente",
        "id_generado": nueva_solicitud.ID_Solicitud,
        "notificacion_jefe": "Enviada con éxito"
        if correo_enviado
        else "No enviada (empleado no hallado o error de correo)",
    }


@app.post("/api/navision")
def crear_detalle_navision(navision: NavisionCreate, db: Session = Depends(get_db)):
    # Verificar que la solicitud principal exista
    solicitud = (
        db.query(models.Solicitud)
        .filter(models.Solicitud.ID_Solicitud == navision.id_solicitud_principal)
        .first()
    )
    if not solicitud:
        raise HTTPException(status_code=404, detail="Solicitud principal no encontrada")

    nuevo_detalle = models.DetalleNavision(
        ID_Solicitud_Principal=navision.id_solicitud_principal,
        Tipo_Solicitud=navision.tipo_solicitud,
        Acceso_Companias=",".join(navision.acceso_companias),
        Area=navision.area,
        Puestos=",".join(navision.puestos),
        Great=",".join(navision.great),
        Unidad_Negocio=",".join(navision.unidad_negocio),
    )

    db.add(nuevo_detalle)
    db.commit()
    db.refresh(nuevo_detalle)

    return {
        "mensaje": "Detalles de Navision guardados exitosamente",
        "id_navision": nuevo_detalle.ID_Navision,
    }
