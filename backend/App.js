//importa la variable de entorno
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from 'multer';
import path from 'path';
import fs from 'fs'
import cron from 'node-cron';

const app = express();
app.use(cors());
app.use(express.json());

import User from "./models/model.user.js";
import role from './models/model.roles.js';
import Histories from './models/model.histories.js';
import Embarque from './models/model.embarque.js';
import productsList from './models/model.products.js';
import { enviarCorreo } from './email.js';

app.listen(3000, () => {
  console.log("Servidor iniciado en el puerto 3000");
});

//Conexión a MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI
  )
  .then(() => console.log("Conexión a MongoDB exitosa"))
  .catch((err) => console.error("Error al conectar con MongoDB", err));

/*------------------------------------
      configuración de archivos
------------------------------------*/
// Configuración de multer para almacenar los archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './update-products'); // Directorio de destino
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${uniqueSuffix}-${file.originalname}`); // Guardar con un nombre único
  }
});

const upload = multer({ storage: storage });
/*------------------------
  formulario de ingreso
------------------------*/
//ingresar usuarios
app.post("/ingreso", async (req, res) => {
  try {
    const { user, password } = req.body;
    const MAX_ATTEMPTS = 3;
    const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 horas
    const SESSION_DURATION = 15 * 60 * 1000; // 2 minutos (tiempo de sesión activa)

    const foundUser = await User.findOne({ user });
    console.log("Usuario encontrado:", foundUser);

    if (foundUser) {
      // Verifica si la sesión ya ha expirado
      if (foundUser.inicio && foundUser.sessionExpiresAt && Date.now() > foundUser.sessionExpiresAt) {
        foundUser.inicio = false;
        foundUser.sessionExpiresAt = undefined;
        await foundUser.save();
      }

      // Si ya tiene una sesión activa y no ha expirado
      if (foundUser.inicio) {
        console.log("Posee sesion activa: ", foundUser.user);
        return res.status(400).json({ Message: "Ya posee una sesión activa" });
      }

      // Verificar si la cuenta está bloqueada
      if (foundUser.isLocked()) {
        return res.status(403).json({ Message: "Cuenta bloqueada. Intente de nuevo más tarde." });
      }

      const isMatch = await bcrypt.compare(password, foundUser.password);

      if (isMatch) {
        const token = jwt.sign({ user: foundUser.user, role: foundUser.role }, "your_jwt_secret", { expiresIn: '1h' });

        foundUser.loginAttempts = 0;
        foundUser.lockUntil = undefined;
        foundUser.inicio = true; 
        foundUser.sessionExpiresAt = Date.now() + SESSION_DURATION; 
        await foundUser.save();

        return res.status(200).json({
          message: "Código verificado correctamente.",
          token: token,
        });
      } else {
        foundUser.loginAttempts += 1;
        if (foundUser.loginAttempts >= MAX_ATTEMPTS) {
          foundUser.lockUntil = Date.now() + LOCK_TIME;
        }
        await foundUser.save();
        return res.status(401).json({ Message: "Credenciales inválidas" });
      }
    } else {
      return res.status(401).json({ Message: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error("Error al ingresar:", error);
    return res.status(500).json({ Message: "Error interno del servidor" });
  }
});

// Tarea CRON para actualizar sesiones
cron.schedule('*/1 * * * *', async () => {
  const now = Date.now();
  try {
    const result = await User.updateMany(
      { sessionExpiresAt: { $lt: now }, inicio: true },
      { $set: { inicio: false, sessionExpiresAt: undefined } }
    );
    console.log(`Sesiones expiradas actualizadas: ${result.modifiedCount}`);
  } catch (error) {
    console.error("Error al actualizar sesiones:", error);
  }
});


//codigo de verificación de usuarios
app.post("/verificarCodigo", async (req, res) => {
  const { user, codigo } = req.body;
  const MAX_ATTEMPTS = 3;

  try {
    const usuarioEncontrado = await User.findOne({ user });

    if (!usuarioEncontrado) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    if (usuarioEncontrado.isLocked()) {
      return res.status(403).json({ message: "Cuenta bloqueada. Intente de nuevo más tarde." });
    }

    const now = new Date();
    if (
      usuarioEncontrado.codigo.verificationCode === codigo &&
      new Date(usuarioEncontrado.codigo.codeExpiration) > now
    ) {
      usuarioEncontrado.verificationAttempts = 0;
      await usuarioEncontrado.save();

      let token;
      if (usuarioEncontrado.role === "admin" || usuarioEncontrado.role === "user") {
        token = jwt.sign(
          {
            user: usuarioEncontrado.user,
            role: usuarioEncontrado.role,
            name_product: usuarioEncontrado.name_product,
          },
          "tu_clave_secreta",
          { expiresIn: "1h" }
        );

        await User.updateOne(
          { user },
          {
            $set: { inicio: true },
          }
        );

        return res.json({ message: "Código verificado correctamente.", token });
      }
    } else {
      usuarioEncontrado.verificationAttempts += 1;
      if (usuarioEncontrado.verificationAttempts >= MAX_ATTEMPTS) {
        usuarioEncontrado.lockUntil = Date.now(); // Bloquear inmediatamente
      }
      await usuarioEncontrado.save();
      console.log("Intentos fallidos de inicio de sesión:", usuarioEncontrado.verificationAttempts);
      return res.status(401).json({ message: "Código incorrecto o expirado." });
    }
  } catch (error) {
    console.error("Error al verificar el código:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
});

/*---------------------
  cierre de sesión
---------------------*/
app.post("/cierreSesion", async (req, res) => {
  try {
    const { user } = req.body;

    // Verificar si el usuario fue enviado en el cuerpo de la solicitud
    if (!user) {
      return res.status(400).json({ message: "El usuario es requerido" });
    }

    // Buscar el usuario por su nombre de usuario
    const foundUser = await User.findOne({ user });

    if (foundUser) {
      // Actualizar el campo "inicio" a false para cerrar sesión
      await User.updateOne(
        { user },
        {
          $set: { inicio: false },
        }
      );
      console.log("Cierre de sesión para:", foundUser);

      res.json({ message: "Cierre de sesión exitoso" });
    } else {
      res.status(404).json({ message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


/*-----------------------------
    formulario de desbloqueo
-----------------------------*/
app.post("/validacion", async (req, res) => {
  try {
    const user = await User.findOne({
      user: req.body.user,
      correo: req.body.correo,
    });
    console.log("user", user);

    if (user) {
      const codigoVerificacion = Math.floor(
        100000 + Math.random() * 900000
      ).toString(); // Genera un código de 6 dígitos
      const codeExpiration = new Date();
      codeExpiration.setMinutes(codeExpiration.getMinutes() + 10);

      // Aquí debes actualizar el usuario con el nuevo código y su expiración
      await User.updateOne(
        { user: req.body.user },
        {
          $set: {
            "codigo.verificationCode": codigoVerificacion,
            "codigo.codeExpiration": codeExpiration,
          },
        }
      );

      // Ahora envía el correo con el código de verificación
      const correoEnviado = await enviarCorreo(user.correo, codigoVerificacion);

      if (correoEnviado) {
        res.json({ Message: "Código de verificación enviado al correo.", correo: user.correo });
      } else {
        res.status(500).json({ error: "No se pudo enviar el correo." });
      }
    } else {
      res.status(401).json({ Message: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error("Error al ingresar:", error);
    res.status(500).json({ Message: "Error interno del servidor" });
  }
});

app.post("/actualizarContrasena", async (req, res) => {
  const { user, newPassword } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const usuarioEncontrado = await User.findOne({ user });

    if (!usuarioEncontrado) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    usuarioEncontrado.password = hashedPassword;
    usuarioEncontrado.loginAttempts = 0;
    usuarioEncontrado.verificationAttempts = 0;
    usuarioEncontrado.lockUntil = null;
    await usuarioEncontrado.save();

    res.json({ message: "Contraseña actualizada correctamente." });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

/*-----------------------------
    formulario de registro
-----------------------------*/
//registrar usuarios
app.post("/registro", async (req, res) => {
  try {
    const { user, password, correo, role } = req.body;

    // Verificar si ya existe un usuario con el mismo nombre
    const existingUser = await User.findOne({ user });
    if (existingUser) {
      return res.status(400).json({ error: "El nombre de usuario ya existe." });
    }
    
    // Validación de la contraseña
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ error: "La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales." });
    }

    // Cifrado de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      user,
      password: hashedPassword,
      correo,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (err) {
    console.error("Error al guardar los datos en la base de datos", err);
    res.status(500).json({ error: "Error al guardar los datos en la base de datos" });
  }
});

//recuperar roles
app.get("/roles", async (req, res) => {
  try {
    const objRoles = await role.find({});
    console.log(objRoles);
    res.json({ objData: objRoles });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Error al recuperar roles" });
  }
});

/*-------------------------------
            HISTORICO
-------------------------------*/
//visualizar lista de historico
app.post("/visualizarHistorico", async (req, res) => {
  try {
    const histories = await Histories.find({});
    console.log(histories);

    if (!histories || histories.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Historial no encontrado" });
    }

    // Mapear los registros para formatear las fechas con la zona horaria de Venezuela
    const formattedHistories = histories.map((history) => {
      const formattedDate = new Date(history.date).toLocaleString('es-ES', {
        timeZone: 'America/Caracas',  // Ajustar a la zona horaria de Venezuela
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      return {
        ...history._doc,
        date: formattedDate // Reemplazar la fecha por la fecha formateada
      };
    });

    return res.json({ status: "success", data: formattedHistories });
  } catch (error) {
    console.error("Error en la ruta:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
});

/*---------------------------
      LISTADO DE LOTES
---------------------------*/
//listado de embarque
app.post("/visualizarEmbarque", async (req, res) => {
  try {
    const embarque = await Embarque.find({});
    console.log(embarque);

    if (!embarque || embarque.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "embarque no encontrado" });
    }

    return res.json({ status: "success", data: embarque }); // Devuelve un array con todos los registros
  } catch (error) {
    console.error("Error en la ruta:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
});

//visualizar embraque en particular
app.post("/obtenerLote/:loteId", async (req, res) => {
  try {
    const { loteId } = req.params;  // Extraemos loteId de los parámetros de la URL
    // Buscamos un único embarque que coincida con el loteId
    const embarque = await Embarque.findOne({ id: loteId });  // Suponemos que 'id' es el campo clave para el lote

    if (!embarque) {
      return res.status(404).json({ status: "error", message: "Embarque no encontrado" });
    }
    console.log(embarque);
    return res.json({ status: "success", data: embarque }); // Devolvemos el objeto embarque
  } catch (error) {
    console.error("Error en la ruta:", error);
    return res.status(500).json({ status: "error", message: "Error interno del servidor" });
  }
});

//listado de productos
/*app.post("/visualizarProductos", async (req, res) => {
  try {
    const { loteId } = req.body; //recibir el loteId en lugar de loteId

    console.log("loteId recibido:", loteId);

    if (!loteId) {
      return res.status(400).json({ status: "error", message: "No se proporcionó el loteId" });
    }

    // Busca productos que tengan el loteId proporcionado
    const listProduct = await productsList.find({ id: loteId }); // Asegúrate de usar el campo correcto
    console.log("Productos encontrados:", listProduct);

    if (!listProduct || listProduct.length === 0) {
      return res
        .status(404)
        .json({ status: "error", message: "Productos no encontrados para el lote dado" });
    }

    return res.json({ status: "success", data: listProduct }); // Devuelve los productos encontrados
  } catch (error) {
    console.error("Error en la ruta:", error);
    return res
      .status(500)
      .json({ status: "error", message: "Error interno del servidor" });
  }
});*/


app.post('/visualizarProductos', async (req, res) => {
  const { loteId } = req.body; // Recibimos el ID del lote desde el frontend

  try {
    // Buscamos el producto en la base de datos usando el ID del embarque
    const product = await productsList.findOne({ id: loteId });

    if (!product) {
      console.log('Producto no encontrado con el ID:', loteId);
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Ruta del archivo que está en la base de datos
    const filePath = path.resolve(product.documento);
    console.log('Ruta del archivo:', filePath);

    // Leer el archivo
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        console.error('Error al leer el archivo:', err);
        return res.status(500).json({ error: 'Error al leer el archivo' });
      }

      console.log('Contenido del archivo leído:', data);

      // Procesar el archivo dependiendo del formato
      if (filePath.endsWith('.json')) {
        // Si es un archivo JSON
        const jsonData = JSON.parse(data);
        res.status(200).json({ data: jsonData });
      } else if (filePath.endsWith('.csv')) {
        // Si es un archivo CSV, puedes convertirlo a JSON si lo prefieres
        const csvData = data.split('\n').map(row => row.split(','));
        res.status(200).json({ data: csvData });
      } else {
        res.status(400).json({ error: 'Formato de archivo no soportado' });
      }
    });
  } catch (error) {
    console.error('Error al obtener el producto:', error);
    res.status(500).json({ error: 'Error al obtener el producto' });
  }
});


/*---------------------------
      formulario de lote
---------------------------*/
/*app.post("/registroLote/:user", async (req, res) => {
  try {
    const { user } = req.params; // Obtenemos el lote y el usuario desde los parámetros de la URL
    const { id, lote, fechaEmbarque, origen, embarque, SENIAT, fechaDesembarque } = req.body;

    const newUser = new Embarque({
      id,
      lote,
      fechaEmbarque,
      origen,
      embarque,
      SENIAT,
      fechaDesembarque
    });

    await newUser.save();

    // Registrar en el historial la actualización del lote
    const currentDate = new Date();
    const dateISO = currentDate.toISOString();  // Formato de fecha ISO
    const dateFormatted = currentDate.toLocaleDateString('es-ES');  // Fecha en formato 'dd/mm/yyyy'

    const newHistory = new Histories({
      user: user,
      accion: 'Agregó',
      documento: `Lote ${id}`,
      date: dateISO,
      dateFormat: dateFormatted
    });

    await newHistory.save();
    res.status(201).json({ message: "Usuario registrado con éxito" });
  } catch (err) {
    console.error("Error al guardar los datos en la base de datos", err);
    res.status(500).json({ error: "Error al guardar los datos en la base de datos" });
  }
});*/

// Ruta para manejar la subida del archivo y guardar los datos
app.post("/registroLote/:user", upload.single('documento'), async (req, res) => {
  try {
    console.log("registro de nuevo embarque")
    const { user } = req.params;
    const { id, lote, fechaEmbarque, origen, embarque, SENIAT, fechaDesembarque } = req.body;

    console.log('Datos recibidos:', { id, lote, fechaEmbarque, origen, embarque, SENIAT, fechaDesembarque });

    const documentoPath = req.file ? req.file.path : null; // Ruta del archivo subido

    console.log("documento recibido", documentoPath);

    // Verificar si el id ya está registrado
    const existingLote = await Embarque.findOne({ id: id });
    if (existingLote) {
      return res.status(400).json({ error: "Lote ya registrado" });
    }

    // Guardar el embarque si no existe
    const newUser = new Embarque({
      id,
      lote,
      fechaEmbarque,
      origen,
      embarque,
      SENIAT,
      fechaDesembarque
    });

    await newUser.save();

    // Guardar la referencia al archivo en productsList
    if (documentoPath) {
      const newProduct = new productsList({
        id: `${id}`,
        documento: documentoPath // Guardar la ruta del archivo
      });
      await newProduct.save();
    }

    // Registrar en el historial
    const currentDate = new Date();
    const dateISO = currentDate.toISOString();
    const dateFormatted = currentDate.toLocaleDateString('es-ES');

    const newHistory = new Histories({
      user: user,
      accion: 'Agregó Lote',
      documento: `Lote ${id}`,
      date: dateISO,
      dateFormat: dateFormatted
    });

    await newHistory.save();
    res.status(201).json({ message: "Lote registrado con éxito" });
  } catch (err) {
    console.error("Error al guardar los datos en la base de datos", err);
    res.status(500).json({ error: "Error al guardar los datos en la base de datos" });
  }
});

/*---------------------------------------------
    ELIMINAR LISTADO Y GUARDAR HISTORICO
---------------------------------------------*/
//eliminar embarque y producto
app.delete('/EliminarEmbarque/:loteId/:user', async (req, res) => {
  const session = await mongoose.startSession(); // Inicia una sesión de transacción
  session.startTransaction();
  try {
    const loteId = parseInt(req.params.loteId); // Asegúrate de que el ID es un número si tu modelo lo requiere así
    const { user } = req.params; // Obtenemos el nombre del usuario desde los parámetros de la URL

    // 1. Eliminar el embarque
    const resultEmbarque = await Embarque.deleteOne({ id: loteId }).session(session);

    if (resultEmbarque.deletedCount === 0) {
      await session.abortTransaction(); // Aborta la transacción si no se encuentra el embarque
      session.endSession();
      return res.status(404).send("Embarque no encontrado");
    }

    // 2. Eliminar todos los productos asociados con el loteId
    const resultProducts = await productsList.deleteMany({ id: loteId.toString() }).session(session);

    // 3. Registrar en el historial la eliminación del lote
    const currentDate = new Date();
    const dateISO = currentDate.toISOString();  // Formato de fecha ISO
    const dateFormatted = currentDate.toLocaleDateString('es-ES');  // Fecha en formato 'dd/mm/yyyy'

    const newHistory = new Histories({
      user: user,
      accion: 'eliminó Embarque',
      documento: `Lote ${loteId}`,  // Usamos loteId para identificar el documento eliminado
      date: dateISO,
      dateFormat: dateFormatted
    });

    await newHistory.save({ session });  // Guardar el historial en la base de datos en la misma transacción

    // 4. Confirma la transacción
    await session.commitTransaction();
    session.endSession();

    console.log("Embarque eliminado", resultEmbarque);
    console.log("Productos eliminados", resultProducts);
    console.log("Historial registrado");

    res.json({ success: true, message: "Embarque y productos relacionados eliminados exitosamente y registrado en el historial" });
  } catch (error) {
    // Aborta la transacción en caso de error
    await session.abortTransaction();
    session.endSession();
    console.error("Error al eliminar el embarque y los productos:", error);
    res.status(500).send("Error interno del servidor");
  }
});
/*---------------------------------------------
    MODIFICAR LISTADO Y GUARDAR HISTORICO
---------------------------------------------*/
app.post('/ModificarEmbarque/:loteId/:user', upload.single('documento'), async (req, res) => {
  try {
    const { loteId, user } = req.params; // Obtenemos el lote y el usuario desde los parámetros de la URL
    const { id, lote, fechaEmbarque, origen, embarque, SENIAT, fechaDesembarque } = req.body; // Nuevos datos del lote

    // Actualizar el producto con los nuevos datos
    const result = await Embarque.updateOne(
      { id: loteId }, // Filtro por lote
      {
        $set: {
          id,
          lote,
          fechaEmbarque,
          origen,
          embarque,
          SENIAT,
          fechaDesembarque
        }
      }
    );

    const documentoPath = req.file ? req.file.path : null;  // Ruta del archivo subido
    if (!documentoPath) {
      return res.status(400).send("No se ha subido ningún archivo");
    }

    // Actualiza la referencia al archivo en productsList
    const resul = await productsList.updateOne(
      { id: loteId },  // Filtro por id del lote
      {
        $set: {
          documento: documentoPath
        }
      }
    );

    if (result.modifiedCount === 0 || resul.modifiedCount === 0) {
      return res.status(404).send("Producto no encontrado o no modificado");
    }

    // Registrar en el historial la actualización del lote
    const currentDate = new Date();
    const dateISO = currentDate.toISOString();  // Formato de fecha ISO
    const dateFormatted = currentDate.toLocaleDateString('es-ES');  // Fecha en formato 'dd/mm/yyyy'

    const newHistory = new Histories({
      user: user,
      accion: 'Actualizó Embarque',
      documento: `Lote ${loteId}`,
      date: dateISO,
      dateFormat: dateFormatted
    });

    await newHistory.save();  // Guardar el historial en la base de datos

    console.log("Lote actualizado y registrado en el historial", result);
    res.json({ success: true, message: "Producto actualizado exitosamente" });
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});

//modificar producto
app.post('/ModificarProduct/:lote/:user', upload.single('documento'), async (req, res) => {
  try {
    const { lote, user } = req.params;

    const documentoPath = req.file ? req.file.path : null;  // Ruta del archivo subido
    if (!documentoPath) {
      return res.status(400).send("No se ha subido ningún archivo");
    }

    // Actualiza la referencia al archivo en productsList
    const result = await productsList.updateOne(
      { id: lote },  // Filtro por id del lote
      {
        $set: {
          documento: documentoPath
        }
      }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).send("No se pudo modificar el producto, ya estaba con los mismos datos o no existe");
    }

    // Registrar en el historial
    const currentDate = new Date();
    const dateISO = currentDate.toISOString();  // Formato de fecha ISO
    const dateFormatted = currentDate.toLocaleDateString('es-ES');  // Fecha en formato 'dd/mm/yyyy'

    const newHistory = new Histories({
      user: user,
      accion: 'Actualizó Archivo',
      documento: `Producto ${lote}`,
      date: dateISO,
      dateFormat: dateFormatted
    });

    await newHistory.save();  // Guardar el historial en la base de datos

    console.log("Producto modificado y registrado en el historial", result);
    res.json({ success: true, message: "Producto modificado exitosamente" });
  } catch (error) {
    console.error("Error al modificar el producto:", error);
    res.status(500).send("Error interno del servidor");
  }
});
