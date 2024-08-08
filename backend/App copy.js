//importa la variable de entorno
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from "bcrypt";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

import User from "./models/model.user.js";
import role from './models/model.roles.js';
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

/*------------------------
  formulario de ingreso
------------------------*/
//ingresar usuarios
app.post("/ingreso", async (req, res) => {
  try {
    const { user, password } = req.body;
    const MAX_ATTEMPTS = 3;
    const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 horas

    // Busca el usuario por su nombre de usuario
    const foundUser = await User.findOne({ user });
    console.log("Usuario encontrado:", foundUser);

    if (foundUser) {
      // Verificar si ya tiene una sesión activa
      if (foundUser.inicio) {
        console.log("Posee sesion activa: ", foundUser.user);
        return res.status(400).json({ Message: "Ya posee una sesión activa" });
      }

      // Verificar si el usuario está bloqueado
      if (foundUser.isLocked()) {
        console.log("Cuenta bloqueada:", foundUser.user);
        return res.status(403).json({ Message: "Cuenta bloqueada. Intente de nuevo más tarde." });
      }

      // Compara la contraseña ingresada con la hasheada almacenada
      const isMatch = await bcrypt.compare(password, foundUser.password);

      if (isMatch) {
        // Restablecer intentos fallidos y bloqueo
        foundUser.loginAttempts = 0;
        foundUser.lockUntil = undefined;
        await foundUser.save();

        // Generar y enviar el código de verificación
        const codigoVerificacion = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiration = new Date();
        codeExpiration.setMinutes(codeExpiration.getMinutes() + 10);

        await User.updateOne(
          { user },
          {
            $set: {
              "codigo.verificationCode": codigoVerificacion,
              "codigo.codeExpiration": codeExpiration,
            },
          }
        );

        // Envía el correo con el código de verificación
        const correoEnviado = await enviarCorreo(foundUser.correo, codigoVerificacion);
        console.log("Correo enviado:", correoEnviado);

        if (correoEnviado) {
          let respuesta = {
            Message: "Código de verificación enviado al correo.",
            correo: foundUser.correo,
            role: foundUser.role,
            name_product: foundUser.name_product,
          };

          res.json(respuesta);
        } else {
          console.log("Error al enviar el correo.");
          res.status(500).json({ error: "No se pudo enviar el correo." });
        }
      } else {
        foundUser.loginAttempts += 1;
        if (foundUser.loginAttempts >= MAX_ATTEMPTS) {
          foundUser.lockUntil = Date.now() + LOCK_TIME;
        }
        await foundUser.save();
        console.log("Intentos fallidos de inicio de sesión:", foundUser.loginAttempts);

        res.status(401).json({ Message: "Credenciales inválidas" });
      }
    } else {
      console.log("Usuario no encontrado.");
      res.status(401).json({ Message: "Credenciales inválidas" });
    }
  } catch (error) {
    console.error("Error al ingresar:", error);
    res.status(500).json({ Message: "Error interno del servidor" });
  }
});

//codigo de verificación de usuarios
app.post("/verificarCodigo", async (req, res) => {
  const { user, codigo } = req.body;
  const MAX_ATTEMPTS = 3;
  const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 horas

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
        usuarioEncontrado.lockUntil = Date.now() + LOCK_TIME;
      }
      await usuarioEncontrado.save();

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

    // Busca el usuario por su nombre de usuario
    const foundUser = await User.findOne({ user });

    if (foundUser) {
      // Actualiza el campo "inicio" a false
      await User.updateOne(
        { user },
        {
          $set: { inicio: false },
        }
      );
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